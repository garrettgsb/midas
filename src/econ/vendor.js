import _ from 'lodash';

import ResourcePool from 'ECON/resourcePool.js';

const legalResourceNames = ResourcePool.resourceNames;

class Vendor {

  constructor(config) {
    this.config = config;
    this.prices = {};
    for (var resource of legalResourceNames) {
      this.prices[resource] = {
        buy: undefined,
        sell: undefined,
        lastBuy: undefined,
        lastSell: undefined
      };
    }
  }


  setPrice(resource, newSetting) {
    if (legalResourceNames.contains(resource)) {
      if (_.isNumber(newSetting.buy)) { this.prices[resource].buy = newSetting.buy; }
      if (_.isNumber(newSetting.sell)) { this.prices[resource].sell = newSetting.sell; }
    }
  }



}


export default Vendor;
