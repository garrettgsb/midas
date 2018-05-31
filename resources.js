class Resource {
  constructor(forceUpdate) {
    this.forceAppUpdate = forceUpdate;
    this.quantity = 0; // Current quantity
    this.produced = 0; // Amount produced ever, i.e. ignoring spent
    this.name = 'unnamed resource';
    this.label = 'Unnamed Resource';
    this.unlocked = false;
    this.transmutationTargets = {};
    this.findVolume = 1;
    this.find = () => this.quantity += this.findVolume;
  }

  setQuantity(q) {
    this.quantity = q;
  }

  incrementBy(q) {
    this.quantity += q;
    this.produced += q;
  }

  canTransmuteTo(target) {
    if (!target) return false;
    return this.transmutationTargets[target.name] && this.transmutationTargets[target.name] <= this.quantity;
  }

  transmute(target) {
    if (this.canTransmuteTo(target)) {
      this.incrementBy(-1 * this.transmutationTargets[target.name]);
      this.forceAppUpdate();
      return true;
    }
    return false;
  }
}

class Spinach extends Resource {
  constructor(forceUpdate) {
    super(forceUpdate)
    this.label = 'Spinach';
    this.name = 'spinach';
    this.quantity = 0;
    this.unlocked = true;
    this.verb = 'Pluck';
    this.transmutationTargets = {iron: 3};
    this.find = () => {
      this.quantity += this.findVolume;
      this.forceAppUpdate();
    };
  }
}

class Iron extends Resource {
  constructor(forceUpdate) {
    super(forceUpdate)
    this.label = 'Iron';
    this.name = 'iron';
    this.quantity = 0;
    this.unlocked = true;
    this.verb = 'Scrounge';
    this.transmutationTargets = {lead: 2};
    this.find = () => {
      this.quantity += this.findVolume;
      this.forceAppUpdate();
    };
  }
}

class Tin extends Resource {
  constructor(forceUpdate) {
    super(forceUpdate)
    this.label = 'Tin';
    this.name = 'tin';
    this.quantity = 0;
    this.unlocked = true;
    this.verb = 'Scrounge';
    this.transmutationTargets = {lead: 4};
    this.find = () => {
      this.quantity += this.findVolume;
      this.forceAppUpdate();
    };
  }
}

class Lead extends Resource {
  constructor(forceUpdate) {
    super(forceUpdate)
    this.label = 'Lead';
    this.name = 'lead';
    this.quantity = 0;
    this.unlocked = true;
    this.verb = 'Scrounge';
    this.transmutationTargets = {gold: 10};
    this.find = () => {
      this.quantity += this.findVolume;
      this.forceAppUpdate();
    };
  }
}

class Gold extends Resource {
  constructor(forceUpdate) {
    super(forceUpdate)
    this.label = 'Gold';
    this.name = 'gold';
    this.quantity = 0;
    this.unlocked = true;
    this.verb = '💥';
    this.transmutationTargets = [];
    this.find = null;
  }
}

export { Spinach, Iron, Tin, Lead, Gold };
export default Resource;
