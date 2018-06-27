class Industry {
  constructor(RPOT, forceUpdate) {
    this.name = 'unnamed resource';
    this.label = 'Unnamed Resource';
    this.targetResource = 'untargeted industry';
    this.costToBuild = 10;
    this.maxQuantity = 0;
    this.incrementMaxBy = 10;
    this.quantity = 0;
    this.lastTick = 0;
    this.tickLength = 1000;
    this.forceAppUpdate = forceUpdate;
    RPOT.subscribe(this);
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
    this.forceAppUpdate();
  }

  collect(resource) {
    resource.incrementBy(this.quantity);
    this.quantity = 0;
    this.forceAppUpdate();
  }

  canAfford(gold) {
    return gold < this.costToBuild
  }

  increaseBuildCost() {
    this.costToBuild = this.costToBuild ** 2;
  }
}

class SpinachGarden extends Industry {
  constructor(RPOT, forceAppUpdate) {
    super(RPOT, forceAppUpdate);
    this.name = 'spinachGarden';
    this.label = 'Spinach Garden';
    this.targetResource = 'spinach';
  }
}

class IronMine extends Industry {
  constructor(RPOT, forceAppUpdate) {
    super(RPOT, forceAppUpdate);
    this.name = 'ironMine';
    this.label = 'Iron Mine';
    this.targetResource = 'iron';
  }
}

class TinMine extends Industry {
  constructor(RPOT, forceAppUpdate) {
    super(RPOT, forceAppUpdate);
    this.name = 'tinMine';
    this.label = 'Tin Mine';
    this.targetResource = 'tin';
  }
}

export { SpinachGarden, IronMine, TinMine };
export default Industry;
