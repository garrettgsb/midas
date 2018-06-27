class Resource {
  constructor(forceUpdate) {
    this.forceAppUpdate = forceUpdate;
    this.quantity = 0; // Current quantity
    this.produced = 0; // Amount produced ever, i.e. ignoring spent
    this.name = 'unnamed resource';
    this.label = 'Unnamed Resource';
    this.transmutationTargets = {};
    this.findVolume = 1;
    this.find = () => this.quantity += this.findVolume;
  }

  get unlocked() {
    return false;
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
    this.verb = 'Pluck';
    this.transmutationTargets = {iron: 3};
    this.find = () => {
      this.quantity += this.findVolume;
      this.forceAppUpdate();
    };
  }
  get unlocked() {
    return true;
  }
}

class Iron extends Resource {
  constructor(forceUpdate) {
    super(forceUpdate)
    this.label = 'Iron';
    this.name = 'iron';
    this.quantity = 0;
    this.verb = 'Scrounge';
    this.transmutationTargets = {lead: 2};
    this.find = () => {
      this.quantity += this.findVolume;
      this.forceAppUpdate();
    };
  }
  get unlocked() {
    return true;
  }
}

class Tin extends Resource {
  constructor(forceUpdate) {
    super(forceUpdate)
    this.label = 'Tin';
    this.name = 'tin';
    this.quantity = 0;
    this.verb = 'Scrounge';
    this.transmutationTargets = {iron: 4, lead: 10};
    this.find = () => {
      this.quantity += this.findVolume;
      this.forceAppUpdate();
    };
  }

  get unlocked() {
    // TODO: un-inject AIDS
    return window.globalState.resources.gold.produced >= 10;
  }
}

class Lead extends Resource {
  constructor(forceUpdate) {
    super(forceUpdate)
    this.label = 'Lead';
    this.name = 'lead';
    this.quantity = 0;
    this.verb = 'Scrounge';
    this.transmutationTargets = {gold: 10};
    this.find = () => {
      this.quantity += this.findVolume;
      this.forceAppUpdate();
    };
  }

  get unlocked() {
    return true;
  }
}

class Gold extends Resource {
  constructor(forceUpdate) {
    super(forceUpdate)
    this.label = 'Gold';
    this.name = 'gold';
    this.quantity = 0;
    this.verb = '💥';
    this.transmutationTargets = [];
    this.find = null;
  }

  get unlocked() {
    return true;
  }
}

export { Spinach, Iron, Tin, Lead, Gold };
export default Resource;
