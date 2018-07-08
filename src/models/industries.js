import autobind from 'autobind-decorator';
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
      return false; // Nothing happens on tick by default
    }

    @autobind
    build(gold) {
      this.maxQuantity += this.incrementMaxBy;
      gold.quantity -= this.costToBuild;
      this.increaseBuildCost();
      forceUpdate();
    }

    @autobind
    collect(resource) {
      resource.quantity += this.quantity;
      this.quantity = 0;
      forceUpdate();
    }

    canAfford(gold) {
      return gold < this.costToBuild;
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

  class Mine extends Industry {
    constructor(config) {
      super();
      this.label = config.label || 'Unnamed Mine';
      this.name = config.name || 'unnamedMine';
      this.resource = config.resource || 'empty space';
      this.type = 'mine';

      // I think the idea here is that any data that might be procedurally generated
      // or procedurally manipulated in the course of the game should go in state.
      // Maybe "gameState" would be a better name, but we'll stick with this for now.
      this.state = {
        costToBuild: 10,
        costToProspect: 10,
        depletionPenalty: 3,
        purchased: true,
        quantity: 0,
        resevoirSize: 10,
        resevoirUsed: 0,
        yieldRange: [1, 5], // Range of how much you find per go
      };
    }

    get resevoir() {
      return Math.max(this.state.resevoirSize - this.state.resevoirUsed, 0);
    }

    @autobind
    mine() {
      let actualYield;

      if (this.resevoir > 0) this.state.resevoirUsed += 1;

      actualYield = this._yield();
      this.state.quantity += actualYield;
      forceUpdate();
    }

    @autobind
    prospect() {
      // If you have the thalers, expand the resevoir by some random amount.
      if (this.canProspect) {
        this.state.resevoirSize += 100; // TODO: Different plan for figuring out how much to prospect
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
      if (this.resevoir > 0) return normalYield;
      const depletedYield = normalYield - this.state.depletionPenalty;
      return depletedYield > 0 ? depletedYield : 0;
    }
  }

  var industries_array = [
    new SpinachGarden(),

    new Mine({
      name: 'Silver Mine',
      label: 'silverMine',
      resource: 'silver',
    }),
    new Mine({
      name: 'Iron Mine',
      label: 'ironMine',
      resource: 'iron',
    }),
    new Mine({
      name: 'Tin Mine',
      label: 'tinMine',
      resource: 'tin',
    }),
  ];

  var industries_object = {};
  for (var item of industries_array) {
    industries_object[item.name] = item;
  }
  return industries_object;
};
