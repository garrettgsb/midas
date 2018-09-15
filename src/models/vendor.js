const _ = require('lodash');


export default (forceUpdate, globalState, ResourcePool) => {

  function _validResourceName(resource) {
    return (ResourcePool.resourceNames.has(resource));
  }

  function _setPrice(vendorObj, priceType, resource, price) {
    if (!_validResourceName(resource)) return;
    if (priceType !== 'buyPrice' && priceType !== 'sellPrice') return;
    if (price <= 0) return;
    if (price === undefined){
      delete vendorObj[resource][priceType];
    } else {
      vendorObj[resource][priceType] = price;
    }
    forceUpdate();
  }

  class Vendor extends ResourcePool {
    constructor() {
      super();
      this.setBuyPrice = (resource, price) => this._setPrice('buyPrice', resource, price);
      this.setSellPrice = (resource, price) => this._setPrice('sellPrice', resource, price);
      this.unsetBuyPrice = (resource, price) => this._setPrice('buyPrice', resource);
      this.unsetSellPrice = (resource, price) => this._setPrice('sellPrice', resource);
    }

    setBuyPrice(resource, price)    { _setPrice(this, 'buyPrice', resource, price); }
    setSellPrice(resource, price)   { _setPrice(this, 'sellPrice', resource, price); }
    unsetBuyPrice(resource, price)  { _setPrice(this, 'buyPrice', resource); }
    unsetSellPrice(resource, price) { _setPrice(this, 'sellPrice', resource); }

    
    // When a market (or other counter-party) is willing to sell to this vendor, it calls doBuy()
    // on the vender, so that the vendor buys some goods from the counter-party.
    //
    // resource: should be a string, an element of ResourcePool.resourceNames
    // quantity: how many of that resource the market wants the vendor to buy
    // price: the price the market proposes, per unit of the resource
    // dryRun: if true, don't actually do the transaction, but give the return value regardless
    // <return value>: the number of units that the vendor actually bought (while obeying constraints)
    doBuy(resource, quantity, price, dryRun = false) {
      // positive quantity means the vendor should buy (from the market)
      // negative quantity means the vendor should sell (to the market)
      if (!_validResourceName(resource)) return 0;
      if (quantity === 0) return 0;

      if (quantity > 0 && price > this[resource].buyPrice) return 0;
      if (quantity < 0 && price < this[resource].sellPrice) return 0;      // buy vs sell means we reverse the inequality

      const maxQuantity = Math.min(this.spareCapacity, Math.floor(this.thalers.quantity/price));
      const minQuantity = -1 * this[resource].quantity;
      const realQuantity = _.clamp(quantity, minQuantity, maxQuantity);
      if (!dryRun) {
        this[resource].quantity += realQuantity;
        this.thalers.quantity -= realQuantity * price;
        forceUpdate();
      }
      return realQuantity;
    }

    doSell(resource, quantity, price, dryRun = false) {
      this.doBuy(resource, -quantity, price, dryRun);
    }

  }


  return Vendor;
};

