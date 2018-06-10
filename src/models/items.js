export default (forceUpdate, globalState) => {

  class Item {
    constructor(config) {
      this.label = config.label || 'Unnamed Item';
      this.name = config.name || config.label;
      this.description = config.description || 'A rare glimpse behind the curtain. Probably here by accident.';
      this.unlocked = config.unlocked || false;
      this.tier = 0;
      this._price = config.price || (tier => ({gold: 666}));
      this.buyAction = config.buyAction || 
        function(tier) { console.log(`You purchased ${this.label} at tier ${this.tier}, good job!`);};
    }

    get canAfford() {
      return globalState.resources.gold.quantity >= this.price.gold;
    }

    get price() {
      return this._price(this.tier);
    }

    buy() {
      if (this.canAfford) {
        globalState.resources.gold.quantity -= this.price.gold;
        this.tier += 1;
        this.buyAction();
        forceUpdate();
        return true;
      }
      return false;
    }
  }

  return [
    new Item({
      label: 'Lead Catalyst', 
      description: 'Reduces the amount of lead required to produce gold',
      price: (tier => ({gold: [3, 9, 81, 6561, 43046721][tier]})),
      buyAction: function(tier) {
        globalState.resources.lead.transmutationTargets.gold -= 1;
      },
    }),
    new Item({
      label: 'Metal Detector', 
      description: 'Find more lead each time you search',
      price: (tier => ({gold: 5**tier})),
      buyAction: function(tier) {
        globalState.resources.lead.findVolume += 1;
      },
    }),
  ];

}
