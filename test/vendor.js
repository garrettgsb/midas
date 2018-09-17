import predi_resource_pool from '../src/models/resourcePool';
const ResourcePool = predi_resource_pool(()=>{}, {});     // lazy lazy mocking

import predi_vendor from '../src/models/vendor';
const Vendor = predi_vendor(()=>{}, {}, ResourcePool);    // lazy lazy mocking


describe("Vendor", () => {

  test("vendors can set their buyPrice and sellPrice, per resource", () => {
    const v = new Vendor();
    expect(v.tin.buyPrice).toBeUndefined();
    expect(v.tin.sellPrice).toBeUndefined();
    v.setBuyPrice('tin', 100);
    expect(v.tin.buyPrice).toBe(100);
    v.setSellPrice('tin', 200);
    expect(v.tin.sellPrice).toBe(200);

    expect(v.spinach.buyPrice).toBeUndefined();
    expect(v.spinach.sellPrice).toBeUndefined();
  });

  test("vendors can cancel their willingness to buy/sell", () => {
    const v = new Vendor();
    expect(v.tin.buyPrice).toBeUndefined();
    v.setBuyPrice('tin', 100);
    v.unsetBuyPrice('tin');
    expect(v.tin.buyPrice).toBeUndefined();

    expect(v.tin.sellPrice).toBeUndefined();
    v.setSellPrice('tin', 100);
    v.unsetSellPrice('tin');
    expect(v.tin.sellPrice).toBeUndefined();
  });

  test("vendors are willing to make sales", () => {
    const v = new Vendor();
    v.tin.set(2);
    v.setSellPrice('tin', 100);
    v.doSell('tin', 1, 100);
    expect(v.tin.quantity).toBe(1);
    expect(v.thalers.quantity).toBe(100);
  });

  test("vendors sales are constrained by price and quantity", () => {
    const v = new Vendor();
    v.tin.set(2);
    v.setSellPrice('tin', 100);

    const actual1 = v.doSell('tin', 1, 10);
    expect(actual1).toBeCloseTo(0);
    expect(v.tin.quantity).toBe(2);
    expect(v.thalers.quantity).toBe(0);

    const actual2 = v.doSell('tin', 4, 120);
    expect(actual2).toBe(2);
    expect(v.tin.quantity).toBeCloseTo(0);
    expect(v.thalers.quantity).toBe(240);

  });

  test("vendors are willing to make buys", () => {
    const v = new Vendor();
    v.thalers.set(1000);
    v.setBuyPrice('tin', 100);
    v.doBuy('tin', 1, 100);
    expect(v.tin.quantity).toBe(1);
    expect(v.thalers.quantity).toBe(900);
  });

  test("vendors buys are constrained by price and thalers and capacity", () => {
    const v = new Vendor(10);
    v.thalers.set(400);
    v.setBuyPrice('tin', 100);

    const actual1 = v.doBuy('tin', 1, 101);
    expect(actual1).toBeCloseTo(0);
    expect(v.thalers.quantity).toBe(400);

    const actual2 = v.doBuy('tin', 10, 90);
    expect(actual2).toBe(4);      // only enough money for 4 (after rounding down to an integer)
    expect(v.tin.quantity).toBe(4);
    expect(v.thalers.quantity).toBe(40);    // money left over

    v.thalers.set(1000);    // refill for next sub-test
    const actual3 = v.doBuy('tin', 10, 80);
    expect(actual3).toBe(6);    // due to capacity limit
    expect(v.tin.quantity).toBe(10);
    expect(v.thalers.quantity).toBe(520);    // money left over
  });

});
