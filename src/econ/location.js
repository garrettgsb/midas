
class Location {
  constructor({x, y}) {
    this.x = x;
    this.y = y;
  }

  distanceTo(otherLoc) {
    let dx = this.x - otherLoc.x;
    let dy = this.y - otherLoc.y;
    return Math.sqrt(dx**2 + dy**2);
  }

  within(otherLoc, delta = 0.2) {
    return this.distanceTo(otherLoc) < delta;
  }

  makeEqualTo(otherLoc) {
    this.x = otherLoc.x;
    this.y = otherLoc.y;
  }

  travelTowardBy(otherLoc, deltaDistance) {
    let dist = this.distanceTo(otherLoc);
    if (dist <= deltaDistance) {
      this.makeEqualTo(otherLoc);
    } else {
      let dx = this.x - otherLoc.x;
      let dy = this.y - otherLoc.y;
      let fraction = deltaDistance/dist;
      this.x += (dx * fraction);
      this.y += (dy * fraction);
    }
  }
}


export default Location;
