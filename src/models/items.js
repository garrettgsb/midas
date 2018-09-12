import _ from 'lodash';

export default (forceUpdate, globalState) => {

  class Item {
    constructor(config) {
      this.label = config.label || 'Unnamed Item';
      this.name = config.name || _.camelCase(this.label);
      this.description = config.description || 'A rare glimpse behind the curtain. Probably here by accident.';
      this._unlocked = config.unlocked || (() => true);
      this.tier = 0;
      this._price = config.price || (tier => ({gold: 666}));
      this.buyAction = config.buyAction;
    }

    get canAfford() {
      return globalState.resources.gold.quantity >= this.price.gold;
    }

    get price() {
      return this._price(this.tier);
    }

    get unlocked() {
      return globalState.resources.gold.produced >= this._price(0).gold;
    }

    buy() {
      if (this.canAfford) {
        globalState.resources.gold.quantity -= this.price.gold;
        this.tier += 1;
        if (this.buyAction) this.buyAction();
        forceUpdate();
        return true;
      }
      return false;
    }
  }

  var items_array = [
    new Item({
      label: 'Lead Catalyst',
      description: 'Reduces the amount of lead required to produce gold',
      price: (tier => ({gold: [3, 9, 81, 6561, 43046721][tier]})),
    }),
    new Item({
      label: 'Metal Detector',
      description: 'Find more lead each time you search',
      price: (tier => ({gold: 5**tier})),
    }),
  ];

  var items_object = {};
  for (var item of items_array) {
    items_object[item.name] = item;
  }
  return items_object;

};
