class Resource {
  constructor(forceUpdate) {
    this.forceAppUpdate = forceUpdate;
    this.quantity = 0;
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
  }

  canTransmuteTo(target) {
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

class Lead extends Resource {
  constructor(forceUpdate) {
    super(forceUpdate)
    this.label = 'Lead';
    this.name = 'lead';
    this.quantity = 0;
    this.unlocked = true;
    this.verb = 'Find';
    this.transmutationTargets = {gold: 10};
    this.find = () => {
      // console.log('find');
      // console.log(this.findVolume);
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

export { Lead, Gold };
export default Resource;
