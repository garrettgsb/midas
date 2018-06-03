class Item {
  constructor(forceUpdate, resources) {
    this.forceAppUpdate = forceUpdate;
    this.resources = resources;
    this.name = 'unnamed item';
    this.label = 'Unnamed Item';
    this.description = 'A rare glimpse behind the curtain. Probably here by accident.';
    this.price = 0;
  }

  get unlocked() {
    return false;
  }

  get canAfford() {
    return this.resources.gold.quantity >= this.price;
  }

  buy() {
    if (this.canAfford) {
      this.resources.gold.quantity -= this.price;
      this.buyAction();
      this.forceAppUpdate();
      return true;
    }
    return false;
  }

  buyAction() {
    console.log(`You purchased ${this.label}, good job!`);
  }
}

class LeadCatalyst extends Item {
  constructor(forceUpdate, resources) {
    super(forceUpdate, resources);
    this.name = 'lead catalyst';
    this.label = 'Lead Catalyst';
    this.description = 'Reduces the amount of lead required to produce gold';
    this.price = 3;
  }

  get unlocked() {
    return true;
  }

  buyAction() {
      this.resources.lead.transmutationTargets.gold -= 1
      this.price = this.price ** 2;
  }
}

class MetalDetector extends Item {
  constructor(forceUpdate, resources) {
    super(forceUpdate, resources);
    this.name = 'metal detector';
    this.label = 'Metal Detector';
    this.description = 'Find more lead each time you search';
    this.price = 1;
  }

  get unlocked() {
    true;
  }

  buyAction() {
    this.resources.lead.findVolume += 1
    this.price *= 5;
  }
}

export { LeadCatalyst, MetalDetector };
export default Item;
