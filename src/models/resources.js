export default (forceUpdate, globalState) => {

  class Resource {
    constructor() {
      this._produced = 0;
      this._consumed = 0;
      this.name = 'unnamed resource';
      this.label = 'Unnamed Resource';
      this.find = () => {
        this.quantity += this.findVolume;
        forceUpdate();
      }
    }

    get quantity() {
      return this._produced - this._consumed;
    }

    set quantity(val) {
      const delta = val - this.quantity;
      if (delta < 0) {
        this._consumed += -delta;
      } else {
        this._produced += delta;
      }
      forceUpdate();
    }

    get produced() {
      return this._produced;
    }

    get unlocked() {
      return true;
    }

    get findVolume() {
      return 1;
    }

    get transmutationTargets() {
      return {};
    }

    canTransmuteTo(target) {
      if (!target) return false;
      return this.transmutationTargets[target.name] && this.transmutationTargets[target.name] <= this.quantity;
    }

    transmute(target) {
      if (this.canTransmuteTo(target)) {
        this.quantity -= this.transmutationTargets[target.name];
        forceUpdate();
        return true;
      }
      return false;
    }
  }

  class Spinach extends Resource {
    constructor() {
      super();
      this.label = 'Spinach';
      this.name = 'spinach';
      this.verb = 'Pluck';
    }

    get unlocked() {
      return globalState.resources.gold.produced >= 3;
    }

    get transmutationTargets() {
      return {iron: 3};
    }
  }

  class Iron extends Resource {
    constructor() {
      super();
      this.label = 'Iron';
      this.name = 'iron';
      this.verb = 'Scrounge';
    }

    get unlocked() {
      return globalState.resources.gold.produced >= 3;
    }

    get transmutationTargets() {
      return {lead: 2};
    }
  }

  class Tin extends Resource {
    constructor() {
      super();
      this.label = 'Tin';
      this.name = 'tin';
      this.verb = 'Scrounge';
    }

    get unlocked() {
      return true;
    }

    get transmutationTargets() {
      return {iron: 4, lead: 10};
    }
  }

  class Lead extends Resource {
    constructor() {
      super()
      this.label = 'Lead';
      this.name = 'lead';
      this.verb = 'Scrounge';
    }

    get findVolume() {
      return 1 + globalState.items.metalDetector.tier;
    }

    get unlocked() {
      return true;
    }

    get transmutationTargets() {
      return {
        gold: 10 - globalState.items.leadCatalyst.tier,
      };
    }
  }

  class Gold extends Resource {
    constructor() {
      super();
      this.label = 'Gold';
      this.name = 'gold';
      this.verb = '💥';
      this.find = null;
    }

    get unlocked() {
      return this.produced > 0;
    }
  }

  class Thaler extends Resource {
    constructor() {
      super();
      this.label = 'Thalers';
      this.name = 'thaler';
      this.quantity = 0;
      this.verb = '💥';
      this.find = null;
    }

    get unlocked() {
      return true;
    }
  }

  class Coffee extends Resource {
    constructor() {
      super();
      this.label = 'Coffee';
      this.name = 'coffee';
    }

    get unlocked() {
      return true;
    }
  }

  class Steel extends Resource {
    constructor() {
      super();
      this.label = 'Steel';
      this.name = 'steel';
    }

    get unlocked() {
      return true;
    }
  }

  class Elo extends Resource {
    constructor() {
      super();
      this.label = 'Elo';
      this.name = 'elo';
      this.verb = 'Grind';
    }

    get unlocked() {
      return true;
    }
  }

  var resources_array = [
    new Spinach(),
    new Iron(),
    new Tin(),
    new Lead(),
    new Gold(),
    new Thaler(),
    new Coffee(),
    new Steel(),
    new Elo(),
  ];

  var resources_object = {};
  for (var item of resources_array) {
    resources_object[item.name] = item;
  }
  return resources_object;

}
