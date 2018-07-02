export default (forceUpdate, globalState) => {

  class Industry {
    constructor() {
      this.label = 'Unnamed Industry';
      this.name = 'unnamedIndustry';
      this.targetResource = 'untargeted industry';
      this.costToBuild = 10;
      this.maxQuantity = 0;
      this.incrementMaxBy = 10;
      this.quantity = 0;
      this.lastTick = 0;
      this.tickLength = 1000;
      globalState.RPOT.subscribe(this);
    }

    tick(now) {
      if (now > this.lastTick + this.tickLength) {
        this.lastTick = now;
        if (this.quantity < this.maxQuantity) this.quantity += 1;
        return true;
      }
      return false;
    }

    build(gold) {
      this.maxQuantity += this.incrementMaxBy;
      gold.quantity -= this.costToBuild;
      this.increaseBuildCost();
      forceUpdate();
    }

    collect(resource) {
      resource.quantity += this.quantity;
      this.quantity = 0;
      forceUpdate();
    }

    canAfford(gold) {
      return gold < this.costToBuild
    }

    increaseBuildCost() {
      this.costToBuild = this.costToBuild ** 2;
    }
  }

  class SpinachGarden extends Industry {
    constructor() {
      super();
      this.name = 'spinachGarden';
      this.label = 'Spinach Garden';
      this.targetResource = 'spinach';
    }
  }

  class IronMine extends Industry {
    constructor() {
      super();
      this.name = 'ironMine';
      this.label = 'Iron Mine';
      this.targetResource = 'iron';
    }
  }

  class TinMine extends Industry {
    constructor() {
      super();
      this.name = 'tinMine';
      this.label = 'Tin Mine';
      this.targetResource = 'tin';
    }
  }

  var industries_array = [
    new SpinachGarden(),
    new IronMine(),
    new TinMine(),
  ];

  var industries_object = {};
  for (var item of industries_array) {
    industries_object[item.name] = item;
  }
  return industries_object;




}

