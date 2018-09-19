const _ = require('lodash');

export default (forceUpdate, globalState) => {

  const legalResourceNames = ['gold', 'lead', 'coffee', 'steel', 'iron', 'tin', 'spinach', 'elo'];

  class ResourcePoolEntry {
    constructor(name, quantity, parentPool) {
      this.name = name;
      this._quantity = 0;
      this.parentPool = parentPool;
      this.tagDeltas = {};
    }

    get label() {
      return _.startCase(this.name);
    }

    delta(quantity, tag, dryRun = false) {
      // Nota Bene: maybe we want an allOrNothing flag, which if true, would limit the return value
      // to be either 0 or quantity
      const mostExtremeDebit = -1 * this._quantity;
      const mostExtremeCredit = (
        this.name === 'thalers' ?
        Infinity :
        this.parentPool.spareCapacity
      );
      quantity = _.clamp(quantity, mostExtremeDebit, mostExtremeCredit);
      if (!dryRun) {
        this._quantity += quantity;
        forceUpdate();
        let tag_suffix = quantity < 0 ? "-DOWN" : "-UP";
        this.tagDeltas[tag + tag_suffix] = (this.tagDeltas[tag + tag_suffix] || 0) + quantity;
      }
      return quantity;
    }

    set(quantity, tag) {
      this.delta(quantity - this._quantity, tag);
      return this.quantity;
    }

    get quantity() {
      return this._quantity;
    }

    set quantity(x) {
      // TODO: remove this entire setter after proof-reading to ensure that no-one is assigning to globalState.resources.XYZ
      console.trace('someone is using the deprecated setter for resource quantity!'); // eslint-disable-line no-console
      this.set(x, 'deprecated setter');
    }

  }

  class ResourcePool {
    constructor(maxCapacity = Infinity, quantityMap = {}) {
      this.maxCapacity = maxCapacity;
      this.entries = [];
      for (let resourceName of ['thalers', ...legalResourceNames]) {
        this[resourceName] = new ResourcePoolEntry(resourceName, quantityMap[resourceName] || 0, this);
        this.entries.push(this[resourceName]);
      }
    }

    get spareCapacity() {
      const usedCapacity = legalResourceNames.map(name => this[name].quantity).reduce((a, b) => a + b, 0)
      return this.maxCapacity - usedCapacity;
    }

    transferTo(otherRP, resource, quantity, tag = "unidentified flying transfer", dryRun = false) {
      const other_side_max = otherRP[resource].delta(quantity, tag, true);
      const this_side_max = -1 * this[resource].delta(-1 * quantity, tag, true);
      const mutual_max = quantity > 0 ? Math.min(other_side_max, this_side_max) : Math.max(other_side_max, this_side_max);
      if (!dryRun) {
        otherRP[resource].delta(mutual_max, tag);
        this[resource].delta(-mutual_max, tag);
      }
      return mutual_max;
    }

    transferFrom(otherRP, resource, quantity, tag = "unidentified flying transfer", dryRun = false) {
      // swap `other` with `this`
      return otherRP.transferTo(this, resource, quantity, tag, dryRun);
    }
  }

  ResourcePool.resourceNames = new Set(legalResourceNames);
  ResourcePool.allResourceNames = new Set(['thalers', ...legalResourceNames]);

  return ResourcePool;

};
