class Industry {
	constructor(RPOT, forceUpdate) {
		this.name = 'unnamed resource';
    this.label = 'Unnamed Resource';
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

	build() {
		this.maxQuantity += this.incrementMaxBy;
		this.forceAppUpdate();
		}
}

class SpinachGarden extends Industry {
	constructor(RPOT, forceAppUpdate) {
		super(RPOT, forceAppUpdate);
		this.name = 'spinachGarden';
		this.label = 'Spinach Garden';
	}
}

export { SpinachGarden };
export default Industry;
