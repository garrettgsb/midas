
const _ = require('lodash');

const legalResourceNames = ['thalers', 'gold', 'lead', 'coffee', 'steel', 'iron', 'tin', 'spinach', 'elo'];

class ResourcePool {
  constructor(maxCapacity = Infinity, quantityMap = {}) {
    this.maxCapacity = maxCapacity;
    this._entries = {};
    this._tagDeltas = {};
    for (let resourceName of legalResourceNames) {
      this._entries[resourceName] = 0;
      this._tagDeltas[resourceName] = {};
    }
  }

  get(res) {
    return this._entries[res];
  }

  set(res, quantity, tag) {
    this.delta(res, quantity - this._quantity, tag);
    return this._entries[res];
  }

  delta(res, quantity, tag) {
    if (!legalResourceNames.find(name => name === res)) return undefined;     // perhaps throw?
    const mostExtremeDebit = -1 * this._entries[res];
    const mostExtremeCredit = this.spareCapacity;
    let final_quantity = _.clamp(quantity, mostExtremeDebit, mostExtremeCredit);

    this._entries[res] += final_quantity;

    let tag_suffix = final_quantity < 0 ? "-DOWN" : "-UP";
    let full_tag = tag + tag_suffix;
    this._tagDeltas[res][full_tag] = (this._tagDeltas[res][full_tag] || 0) + final_quantity;

    return final_quantity;
  }

  get spareCapacity() {
    // TODO: maybe we want some resources to not count against the capacity for some pools.
    let consumedCapacity =
      legalResourceNames
      .filter(name => name !== 'thalers')
      .map(name => this._entries[name])
      .reduce((a, b) => a + b, 0);
    return this.maxCapacity - consumedCapacity;
  }

}

ResourcePool.resourceNames = legalResourceNames;

export default ResourcePool;


// 
// /// TODO: get unit testing working and move this (or something better) to a unit test.
// rp = new ResourcePool(10);
// console.log(0, rp.get('tin'));
// rp.delta('tin', 3, "income");
// console.log(3, rp.get('tin'));
// rp.delta('tin', 3, "income");
// console.log(6, rp.get('tin'));
// rp.delta('tin', -1, "taxation");
// console.log(5, rp.get('tin'));
// rp.delta('tin', -7, "theft");
// console.log(0, rp.get('tin'));
// rp.delta('tin', 15);
// console.log(10, rp.get('tin'));
// console.log('---');
// console.log(rp._tagDeltas);
// console.log('---');
// console.log(rp._entries);
