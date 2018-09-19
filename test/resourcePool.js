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

  test("transfer between pools works", () => {
    const src = new ResourcePool();
    const dst = new ResourcePool();

    src.tin.set(5);
    expect(src.tin.quantity).toBe(5);
    expect(dst.tin.quantity).toBe(0);

    src.transferTo(dst, 'tin', 3);
    expect(src.tin.quantity).toBe(2);
    expect(dst.tin.quantity).toBe(3);
  });

  test("transfer dryRun=true returns hypothesis without change to quantities in pools", () => {
    const src = new ResourcePool();
    const dst = new ResourcePool();

    src.tin.set(5);
    expect(src.tin.quantity).toBe(5);
    expect(dst.tin.quantity).toBe(0);

    const hypothetical = src.transferTo(dst, 'tin', 3, 'dumb tag', true);
    expect(hypothetical).toBe(3);     // dryRun=true should give us the amount we WOULD HAVE transferred
    expect(src.tin.quantity).toBe(5);
    expect(dst.tin.quantity).toBe(0);
  });

  test("transfer between pools respects source constraints", () => {
    const src = new ResourcePool(10);
    const dst = new ResourcePool(100);
    src.tin.set(8);
    expect(src.tin.quantity).toBe(8);

    //
    const actual = src.transferTo(dst, 'tin', 13);
    expect(actual).toBe(8);
    expect(src.tin.quantity).toBe(0);     // because you can't go below zero

    dst.tin.set(100);
    const actual2 = src.transferTo(dst, 'tin', -13);
    expect(actual2).toBe(-10);
    expect(src.tin.quantity).toBe(10);    // because Capacity
  });

  test("transfer between pools respects destination constraints", () => {
    const src = new ResourcePool();
    const dst = new ResourcePool(10);
    src.tin.set(50);
    expect(dst.tin.quantity).toBe(0);

    const actual = src.transferTo(dst, 'tin', 13);
    expect(actual).toBe(10);
    expect(dst.tin.quantity).toBe(10);    // because Capacity

    const actual2 = src.transferTo(dst, 'tin', -13);
    expect(actual2).toBe(-10);
    expect(dst.tin.quantity).toBe(0);     // because you can't go below zero
  });


  test("transferFrom is a convenient alias for transferTo", () => {
    const src = new ResourcePool();
    const dst = new ResourcePool();

    src.tin.set(10);
    const actual = dst.transferFrom(src, 'tin', 5);
    expect(actual).toBe(5);
    expect(src.tin.quantity).toBe(5);
    expect(dst.tin.quantity).toBe(5);

    const actual2 = dst.transferFrom(src, 'tin', 8);
    expect(actual).toBe(5);
    expect(src.tin.quantity).toBe(0);
    expect(dst.tin.quantity).toBe(10);
  });



});
