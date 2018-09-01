const _ = require('lodash');

const legalResourceNames = ['tin', 'lead', 'spinach'];

class ResourcePool {
  constructor(maxCapacity = Infinity, quantityMap = {}) {
    this.maxCapacity = maxCapacity;

    this._entries = {};
    for (let resourceName of legalResourceNames) {
      this._entries[resourceName] = {
        quantity: quantityMap[resourceName] || 0,
        seenTags: new Set(),
      };
    }

    return new Proxy(this, {
      get: (target, propName, receiver) => {
        if (legalResourceNames.includes(propName)) {
          return {
            delta: (quantity, tag) => {
              const entry = this._entries[propName];
              const mostExtremeDebit = -1 * entry.quantity;
              const mostExtremeCredit = this.spareCapacity;
              quantity = _.clamp(quantity, mostExtremeDebit, mostExtremeCredit);
              entry.quantity += quantity;

              entry.seenTags.add(tag);
            },
            quantity: this._entries[propName].quantity,
          }
        } else {
          return this[propName];
        }
      }
    });
  }

  get spareCapacity() {
    return (
      this.maxCapacity - 
      legalResourceNames.map(name => this._entries[name].quantity).reduce((a, b) => a + b, 0)
    );
  }
}

ResourcePool.resourceNames = legalResourceNames;



rp = new ResourcePool(10);
console.log(0, rp.tin.quantity);
rp.tin.delta(3, "income");
console.log(3, rp.tin.quantity);
rp.tin.delta(3, "income");
console.log(6, rp.tin.quantity);
rp.tin.delta(-1, "taxation");
console.log(5, rp.tin.quantity);
rp.tin.delta(-7, "theft");
console.log(0, rp.tin.quantity);
rp.tin.delta(15);
console.log(10, rp.tin.quantity);
console.log(rp._entries.tin.seenTags);
