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
        this.tickAction();
        return true;
      }
      return false;
    }

    tickAction() {
      if (this.quantity < this.maxQuantity) this.quantity += 1;
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

    tickAction() {
      if (this.quantity < this.maxQuantity) this.quantity += 1;
    }
  }

  class SilverMine extends Industry {
    constructor() {
      super();
      this.label = 'Silver Mine';
      this.name = 'silverMine';
      this.resource = 'silver';

      // I think the idea here is that any data that might be procedurally generated
      // or procedurally manipulated in the course of the game should go in state.
      // Maybe "gameState" would be a better name, but we'll stick with this for now.
      this.state = {
        costToBuild: 10,
        costToProspect: 10,
        depletionPenalty: 8,
        purchased: true,
        quantity: 0,
        resevoir: 100,
        yieldRange: [1, 5], // Range of how much you find per go
      };
    }

    tickAction() { return false }

    mine() {
      this.state.quantity += this._yield();
      this.state.resevoir -= 1;
      forceUpdate();
    }

    prospect() {
      // If you have the thalers, expand the resevoir by some random amount.
      if (this.canProspect) {
        this.state.resevoir += 100 // TODO: Different plan for figuring out how much to prospect
      }
    }

    canAfford(thalers=Infinity) {
      return thalers < this.state.costToBuild;
    }

    canProspect(thalers=Infinity) {
      return thalers < this.state.costToProspect;
    }

    _yield() {
      const [min, max] = this.state.yieldRange;
      const normalYield = Math.floor(Math.random() * (max - min)) + min;
      if (this.state.resevoir > 0) return normalYield;
      const depletedYield = normalYield - this.state.depletionPenalty
      return depletedYield > 0 ? depletedYield : 0
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
    new SilverMine(),
    new IronMine(),
    new TinMine(),
  ];

  var industries_object = {};
  for (var item of industries_array) {
    industries_object[item.name] = item;
  }
  return industries_object;




}
