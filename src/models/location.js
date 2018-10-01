const _ = require('lodash');

export default (forceUpdate, globalState) => {

  const allLocations = {};
  const maxId = 0;

  class Location() {
    constructor() {
      this.id = new Symbol("location-" + maxId++);
      allLocations[this.id] = this;
    }
  }

  Location.byId = id => allLocations[id];
  Location.all = () => Object.values(allLocations);
  Location.filter = callback => Object.values(allLocations).filter(callback);

  return Location;
}
