export default (forceUpdate, globalState) => {

  class Resource {
    constructor() {
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
        forceUpdate();
        return true;
      }
      return false;
    }
  }

  class Spinach extends Resource {
    constructor() {
      super()
      this.label = 'Spinach';
      this.name = 'spinach';
      this.quantity = 0;
      this.unlocked = true;
      this.verb = 'Pluck';
      this.transmutationTargets = {iron: 3};
      this.find = () => {
        this.quantity += this.findVolume;
        forceUpdate();
      };
    }
  }

  class Iron extends Resource {
    constructor() {
      super()
      this.label = 'Iron';
      this.name = 'iron';
      this.quantity = 0;
      this.unlocked = true;
      this.verb = 'Scrounge';
      this.transmutationTargets = {lead: 2};
      this.find = () => {
        this.quantity += this.findVolume;
        forceUpdate();
      };
    }
  }

  class Tin extends Resource {
    constructor() {
      super()
      this.label = 'Tin';
      this.name = 'tin';
      this.quantity = 0;
      this.unlocked = true;
      this.verb = 'Scrounge';
      this.transmutationTargets = {iron: 4, lead: 10};
      this.find = () => {
        this.quantity += this.findVolume;
        forceUpdate();
      };
    }
  }

  class Lead extends Resource {
    constructor() {
      super()
      this.label = 'Lead';
      this.name = 'lead';
      this.quantity = 0;
      this.unlocked = true;
      this.verb = 'Scrounge';
      this.transmutationTargets = {gold: 10};
      this.find = () => {
        this.quantity += this.findVolume;
        forceUpdate();
      };
    }
  }

  class Gold extends Resource {
    constructor() {
      super()
      this.label = 'Gold';
      this.name = 'gold';
      this.quantity = 0;
      this.unlocked = true;
      this.verb = '💥';
      this.transmutationTargets = [];
      this.find = null;
    }
  }

  var resources_array = [
    new Spinach(),
    new Iron(),
    new Tin(),
    new Lead(),
    new Gold(),
  ];

  var resources_object = {};
  for (var item of resources_array) {
    resources_object[item.name] = item;
  }
  return resources_object;

}
