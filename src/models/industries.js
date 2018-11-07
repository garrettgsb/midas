import autobind from 'autobind-decorator';
import _ from 'lodash';
export default (forceUpdate, globalState) => {

  class Industry {
    constructor() {
      // TODO: need a config parameter to make subsequent instances more expensive

      this.label = 'Unnamed Industry';
      this.name = 'unnamedIndustry';
      this.type = undefined;      // probably type-less Industries should have no View
      this.tier = 0;
      this._target = undefined;
      this._produced = {};
      this.key = Math.random().toString().substring();

      this.lastTick = 0;
      this.tickLength = 1000;
      globalState.RPOT.subscribe(this);
    }

    tick(now) {
      if (now > this.lastTick + this.tickLength) {
        this.lastTick = now;
        this.tickAction(now);
        return true;
      }
      return false;
    }

    tickAction() {
      return false; // Nothing happens on tick by default
    }

    get target() {
      return this._target;
    }

    set target(target) {      // takes a proper target, OR a target's name
      //console.log("bloooop");
      let targetName = (new Object(target)).name || target;
      if (!this.possibleTargets) {
        console.warn("tried to set target to " + targetName + ", but this instance doesn't have targets");
        return;
      }
      this._target = this.possibleTargets.find(target => target.name === targetName);
      forceUpdate();
    }

    handleTargetChange(newTarget) {
      this.target = newTarget;
    }

    get visible() {
      // If you subclass Industry, you'd better override this!
      throw new Error("Not Implemented: get visible()");
    }

    get canUpgrade() {
      return globalState.resources.thalers.quantity >= this.upgradeCost;
    }

    @autobind
    upgrade() {
      if (this.canUpgrade) {
        globalState.resources.thalers.delta(-this.upgradeCost, "upgrade-industry");
        this.tier += 1;
        forceUpdate();
      }
    }

    get upgradeCost() {
      // TODO: later figure out how to make the first purchase ever cost 1 gold instead of X thalers
      // TODO: Maybe all costs should be objects, mapping resources to quantities.
      //            So instead of `3` meaning "3 thalers", we'd say `{thalers: 3}`
      if (this.tier === 0) {
        return 1;       // TODO: change this to a larger number; it's currently small to make testing easier
      }
      return 2 ** (this.tier-1);
    }
  }

  //  // This is commented out because it's obsolete, but demonstrates how an industry might use ticks/timeloop
  //  class SpinachGarden extends Industry {
  //    constructor() {
  //      super();
  //      this.name = 'spinachGarden';
  //      this.label = 'Spinach Garden';
  //      this.targetResource = 'spinach';
  //    }
  //
  //    tickAction() {
  //      if (this.quantity < this.maxQuantity) this.quantity += 1;
  //    }
  //  }

  class Mill extends Industry {
    constructor() {
      super();
      this.label = 'Mill';
      this.name = 'mill';
      this.type = 'mill';

      // Mills work by requiring the player to take a sequence of actions (currently button-presses).
      // `this.step` records which action/phase/step is the next one to take; when these reach a threshold
      //    (determined by the current resource target), we'll have some yield.

      this.step = 0;
    }

    get visible() {
      return true;
    }

    get possibleTargets() {
      return [
        {name: 'coffee', label: 'Coffee', resource: 'coffee', input: undefined, steps: 3, delay: 0.3, payout: 3},
        {name: 'steel', label: 'Steel', resource: 'steel', input: 'iron', steps: 5, delay: 1, payout: 3},
      ];
    }

    handleTargetChange(newTarget) {
      super.target = newTarget;
      this.step = 0;
    }

    @autobind
    mill(buttonNum, withInput=false) {
      // TODO: think about allowing input
      if (!this.target || !this.target.name) {
        console.warn("Mill.mill was invoked, but we have no target");
        return;   // no target?  no mining!
      }
      if (buttonNum != this.step) {
        // press wrong button?  no cookie!
        return;
      }

      this.step++;
      if (this.step >= this.target.steps) {
        let targetName = this.target.name;
        this._produced[targetName] = (this._produced[targetName] || 0) + this.target.payout;
        globalState.resources[targetName].delta(this.target.payout, "harvest");
        this.step = 0;
      }
      forceUpdate();
    }

    get buttons() {
      if (!this.target) {
        return [];
      }
      return _.range(this.target.steps).map(step => (
        {label: step, active: this.step <= step}
      ));
    }
  }

  class Mine extends Industry {
    constructor(config) {
      super();
      this.label = 'Mine';
      this.name = 'mine';
      this.type = 'mine';
      this._reservoirSize = 10;
      this._reservoirUsed = 0;
      this.prospectCost = 1;

      // I think the idea here is that any data that might be procedurally generated
      // or procedurally manipulated in the course of the game should go in state.
      // Maybe "gameState" would be a better name, but we'll stick with this for now.
      //
      // NOTE: I (jh) think all three of these should be somewhere else, dunno.
      this.state = {
        depletionPenalty: 3,
        yieldRange: [3, 5],
      };
    }

    get visible() {
      return true;
    }

    get possibleTargets() {
      return [
        {name: 'iron', label: 'Iron', resource: 'iron'},
        {name: 'tin', label: 'Tin', resource: 'tin'},
        {name: 'spinach', label: 'Spinach', resource: 'spinach'},
      ];
    }

    get reservoir() {
      return Math.max(this._reservoirSize - this._reservoirUsed, 0);
    }

    @autobind
    mine() {
      if (!this.target || !this.target.name) {
        console.warn("Mine.mine was invoked, but we have no target");
        return;   // no target?  no mining!
      }

      // TODO: does tier affect this?
      let _yield = this._yield;
      let _miningProb = this._miningProb;
      let targetName = this.target.name;

      if (this.reservoir > 0) {
        this._reservoirUsed += 1;
      } else {
        _miningProb /= 5;
      }

      if (Math.random() < _miningProb) {
        this._produced[targetName] = (this._produced[targetName] || 0) + _yield;
        globalState.resources[targetName].delta(_yield, "harvest");
        // TODO: we talked about having some chance of other minerals
      } else {
        // do we do anything when there's no mineral yield?
      }
      forceUpdate();
    }

    get canProspect() {
      // TODO: I don't think this is right.
      return globalState.resources.thalers.quantity >= this.prospectCost;
    }

    @autobind
    prospect() {
      // If you have the thalers, expand the reservoir by some random amount.
      if (this.canProspect) {
        this._reservoirSize += 100; // TODO: Different plan for figuring out how much to prospect
        globalState.resources.thalers.delta(-this.prospectCost, "prospecting");
      }
    }

    get _yield() {
      // TODO: does tier affect this?  it should affect something!
      const [min, max] = this.state.yieldRange;
      const normalYield = Math.floor(Math.random() * (max - min)) + min;
      if (this.reservoir > 0) return normalYield;
      const depletedYield = normalYield - this.state.depletionPenalty;
      return depletedYield > 0 ? depletedYield : 0;
    }

    get _miningProb() {
      return 0.9;
    }
  }

  class Farm extends Industry {
    constructor() {
      super();
      this.label = 'Farm';
      this.name = 'farm';
      this.type = 'farm';
      this.tickLength = 100;
      this._maxReservoir = 100;
      this._currentReservoir = 0;
      this._waterDelta = 5; //How much you increase the _currentReservoir when you add on water click
      this._absorptionDelta = 1; // How much the _currentReservoir is decreased every tick
      this._lastHarvest = 0; //Timestamp in ms
      this._timeBetweenHarvests = 5000; //Amount of time between harvest in ms
      this._upperYield = 10; // Move these into balance file once merged
      this._lowerYield = 5;
      this._upperThreshold = 0.8;
      this._lowerThreshold = 0.5;
    }

    @autobind
    harvest() {
      if (!this.target || !this.target.name) {
        console.warn("Farm.harvest was invoked, but we have no target");
        return;
      }
      this._produced[this.target.name] = (this._produced[this.target.name] || 0) + this._yield;
      globalState.resources[this.target.name].delta(this._yield, "harvest");
      forceUpdate();
    }

    get _yield() {
      if (this._currentReservoir / this._maxReservoir >= this._upperThreshold) {
        return this._upperYield;
      } else if (this._currentReservoir / this._maxReservoir >= this._lowerThreshold) {
        return this._lowerYield;
      } else {
        return 0;
      }
    }

    @autobind
    water() {
      if (this._currentReservoir + this._waterDelta <= this._maxReservoir) {
        this._currentReservoir = Math.max(this._currentReservoir + this._waterDelta, 0);
        forceUpdate();
      }
    }

    tickAction(now) {
      if (this.target) {
        if (this._currentReservoir > 0) {
          this._currentReservoir -= this._absorptionDelta;
        }
        if (this._lastHarvest + this._timeBetweenHarvests < now) {
          this._lastHarvest += this._timeBetweenHarvests;
          this.harvest();
        }
      }
    }

    handleTargetChange(newTarget) {
      super.target = newTarget;
      this._currentReservoir = 0;
    }

    get possibleTargets() {
      return [
        {name: 'spinach', label: 'Spinach', resource: 'spinach'},
        {name: 'elo', label: 'Elo', resource: 'elo'},
      ];
    }

    get visible() {
      return true;
    }
  }

  var industries_array = [
    new Mine(),
    new Mill(),
    new Farm(),
  ];

  return industries_array;
};
