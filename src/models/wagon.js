const _ = require('lodash');

export default (forceUpdate, globalState, ResourcePool, Vendor) => {

  class Wagon extends Vendor {
    constructor(maxCapacity = Infinity) {
      super(maxCapacity);

      this.loc = Location.HomeBase;

    }


    goto(loc) {
      this.loc = loc;
    }


  }

  return Wagon;
};
