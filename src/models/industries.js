import autobind from 'autobind-decorator';
export default (forceUpdate, globalState) => {

  class Industry {
    constructor() {
      // TODO: need a config parameter to make subsequent instances more expensive

      this.label = 'Unnamed Industry';
      this.name = 'unnamedIndustry';
      this.type = undefined;      // probably type-less Industries should have no View
      this.tier = 0;
      this._produced = {};
      this.key = Math.random().toString().substring();

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

    get visible() {
      // If you subclass Industry, you'd better override this!
      throw new Error("Not Implemented: get visible()");
    }

    get canUpgrade() {
      return globalState.resources.thaler.quantity >= this.upgradeCost;
    }

    @autobind
    upgrade() {
      if (this.canUpgrade) {
        globalState.resources.thaler.quantity -= this.upgradeCost;
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



  class Mine extends Industry {
    constructor(config) {
      super();
      this.label = 'Mine';
      this.name = 'mine';
      this.type = 'mine';
      this._reservoirSize = 10;
      this._reservoirUsed = 0;
      this._target = undefined;
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
      return Mine.activities;
    }

    get target() {
      return this._target;
    }

    set target(target) {      // takes a proper target, OR a target's name
      let targetName = (new Object(target)).name || target;
      this._target = Mine.activities.find(act => act.name === targetName);
      forceUpdate();
    }

    get reservoir() {
      return Math.max(this._reservoirSize - this._reservoirUsed, 0);
    }

    @autobind
    mine() {
      if (!this.target) {
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
        globalState.resources[targetName].quantity += _yield;
        // TODO: we talked about having some chance of other minerals
      } else {
        // do we do anything when there's no mineral yield?
      }
      forceUpdate();
    }

    get canProspect() {
      // TODO: I don't think this is right.
      return globalState.resources.thaler.quantity >= this.prospectCost;
    }

    @autobind
    prospect() {
      // If you have the thalers, expand the reservoir by some random amount.
      if (this.canProspect) {
        this._reservoirSize += 100; // TODO: Different plan for figuring out how much to prospect
        globalState.resources.thaler.quantity -= this.prospectCost
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

  Mine.activities = [
    {name: 'iron', label: 'Iron', resource: 'iron'},
    {name: 'tin', label: 'Tin', resource: 'tin'},
    {name: 'spinach', label: 'Spinach', resource: 'spinach'},
  ];

  var industries_array = [
    new Mine(),
  ];

  var industries_object = {};
  for (var item of industries_array) {
    industries_object[item.name] = item;
  }
  return industries_array;
};
