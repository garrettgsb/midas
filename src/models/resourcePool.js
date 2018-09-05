const _ = require('lodash');

export default (forceUpdate, globalState) => {

  const legalResourceNames = ['thalers', 'gold', 'lead', 'coffee', 'steel', 'iron', 'tin', 'spinach', 'elo'];

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

    delta(quantity, tag) {
      const mostExtremeDebit = -1 * this._quantity;
      const mostExtremeCredit = this.parentPool.spareCapacity;
      quantity = _.clamp(quantity, mostExtremeDebit, mostExtremeCredit);
      this._quantity += quantity;
      forceUpdate();
      let tag_suffix = quantity < 0 ? "-DOWN" : "-UP";
      this.tagDeltas[tag + tag_suffix] = (this.tagDeltas[tag + tag_suffix] || 0) + quantity;
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
      console.trace('someone is using the deprecated setter for resource quantity!');
      this.set(x, 'deprecated setter');
    }
  }

  class ResourcePool {
    constructor(maxCapacity = Infinity, quantityMap = {}) {
      this.maxCapacity = maxCapacity;
      this.entries = [];
      for (let resourceName of legalResourceNames) {
        this[resourceName] = new ResourcePoolEntry(resourceName, quantityMap[resourceName] || 0, this);
        this.entries.push(this[resourceName]);
      }
    }

    get spareCapacity() {
      return (
        this.maxCapacity - 
        legalResourceNames.map(name => this[name].quantity).reduce((a, b) => a + b, 0)
      );
    }
  }

  ResourcePool.resourceNames = legalResourceNames;

  return ResourcePool;

}

////// TODO: get unit testing working and move this (or something better) to a unit test.
// rp = new ResourcePool(10);
// console.log(0, rp.tin.quantity);
// rp.tin.delta(3, "income");
// console.log(3, rp.tin.quantity);
// rp.tin.delta(3, "income");
// console.log(6, rp.tin.quantity);
// rp.tin.delta(-1, "taxation");
// console.log(5, rp.tin.quantity);
// rp.tin.delta(-7, "theft");
// console.log(0, rp.tin.quantity);
// rp.tin.delta(15);
// console.log(10, rp.tin.quantity);
// console.log(rp.tin.tagDeltas);
// for(var entry of rp.entries) { console.log(entry.name, entry.label, entry.quantity); }
