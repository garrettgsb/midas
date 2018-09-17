import predi_resource_pool from '../src/models/resourcePool';
const ResourcePool = predi_resource_pool(()=>{}, {});     // lazy lazy mocking


describe("ResourcePool", () => {

  test("basic ability to use delta()", () => {
    const rp = new ResourcePool();
    expect(rp.tin.quantity).toBe(0);
    rp.tin.delta(3);
    expect(rp.tin.quantity).toBe(3);
    rp.tin.delta(-1);
    expect(rp.tin.quantity).toBe(2);
  });

  test("basic ability to use set()", () => {
    const rp = new ResourcePool();
    expect(rp.tin.quantity).toBe(0);
    rp.tin.set(3);
    expect(rp.tin.quantity).toBe(3);
    rp.tin.set(1);
    expect(rp.tin.quantity).toBe(1);
    rp.tin.set(-1);
    expect(rp.tin.quantity).toBe(0);
  });

  test("quantity doesn't drop below 0", () => {
    const rp = new ResourcePool();
    rp.tin.delta(3);
    expect(rp.tin.quantity).toBe(3);
    rp.tin.delta(-4);
    expect(rp.tin.quantity).toBe(0);
  });

  test("quantity is limited by capacity of the pool (single resource)", () => {
    const rp = new ResourcePool(10);
    rp.tin.delta(7);
    const actual = rp.tin.delta(8);
    expect(rp.tin.quantity).toBe(10);
    expect(actual).toBe(3);
  });

  test("quantity is limited by capacity of the pool (multiple resources)", () => {
    const rp = new ResourcePool(10);
    rp.tin.delta(7);
    const actual = rp.spinach.delta(8);
    expect(rp.spinach.quantity).toBe(3);
    expect(actual).toBe(3);
  });

});
