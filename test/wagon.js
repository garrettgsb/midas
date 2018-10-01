import predi_resource_pool from '../src/models/resourcePool';
const ResourcePool = predi_resource_pool(()=>{}, {});     // lazy lazy mocking

import predi_vendor from '../src/models/vendor';
const Vendor = predi_vendor(()=>{}, {}, ResourcePool);    // lazy lazy mocking

import predi_wagon from '../src/models/wagon';
const Wagon = predi_wagon(()=>{}, {}, ResourcePool, Vendor);    // lazy lazy mocking


describe("Wagon", () => {


  test("nothing", () => {
    const w = new Wagon();
    w.goto();
  });




});
