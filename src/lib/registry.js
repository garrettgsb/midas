function makeRegistry(template, _parent, _history = [], _problem) {
  if (arguments.length === 0) {
    template = {};
  }
  function reg(_default) {
    if (template === undefined && _default === makeRegistry.exception) {
      throw new Error("Key sequence lookup failed (at marked element): " + _history.map(k => k===_problem ? `(${k})` : k).join('.'));
    } else if (template === undefined) {
      return _default;
    } else if (typeof template === 'function') {
      return template();
    } else {
      return template;
    }
  }
  const prox = new Proxy(reg, {
    get: function(target, prop, receiver) {
      const _new_problem = _problem || (!(template && template[prop]) && prop);
      return makeRegistry(template && template[prop], prox, [..._history, prop], _new_problem);
    },
    set: function(target, prop, value, receiver) {
      if (template === undefined) {
        const thisName = _history[_history.length - 1];
        _parent[thisName] = template = {};
      }
      template[prop] = value;
      return true;
    }
  });
  return prox;
}

makeRegistry.exception = Symbol("if used as a default value, an exception will be thrown");

module.exports = makeRegistry;



/////////
//
//  The rest of this file is sample/testing code, to explain how to use this function.
//
//  All assertions pass, thereby defining correct/expected behaviour.
//
////////


if (require && require.main && require.main === module) {   // prevents the rest of this code from running if `require`d

  console.log("running registry test suite...");

  function assertEqual(a, b) {
    if (a !== b) {
      throw new Error("failed assertEquals, with arguments:\n\t" + JSON.stringify(a) + "\n\t" + JSON.stringify(b));
    }
  }

  const template = {
    val1: 1,
    nest1: {
      nest2: {
        val3: 3,
      },
      val2: 2,
      fn5: () => 5,
    },
  };

  const registry = makeRegistry(template);

  // vanilla JS behaviour (whether or not this file is used)
  assertEqual(template.val1, 1);
  assertEqual(template.nest1.nest2.val3, 3);
  assertEqual(template.nest1.fn5(), 5);

  // simple equivalents of the above (alas, must add the parentheses)
  assertEqual(registry.val1(), 1);
  assertEqual(registry.nest1.nest2.val3(), 3);
  assertEqual(registry.nest1.fn5(), 5);

  // default behaviour of undefined keys
  assertEqual(registry.garbage("default"), "default");
  assertEqual(registry.garbage(), undefined);

  // behaviour, including defaults, of undefined *nested* keys
  assertEqual(registry.garbage.garbage(), undefined);
  assertEqual(registry.w.x.y.z(), undefined);
  assertEqual(registry.w.x.y.z(1234), 1234);


  // but if you like raising errors, pass makeRegistry.exception as a default argument
  try {
    registry.w.x.y.z(makeRegistry.exception);
    throw new Error("why was no exception thrown?  that is wrong!");
  } catch (err) {
    assertEqual(err.message, "Key sequence lookup failed (at marked element): (w).x.y.z");
  }
  // this also works with only a single failed lookup (whereas vanilla JS only raises when it gets nested failed lookups)
  try {
    registry.w(makeRegistry.exception);
    throw new Error("why was no exception thrown?  that is wrong!");
  } catch (err) {
    assertEqual(err.message, "Key sequence lookup failed (at marked element): (w)");
  }

  // setting new values is also supported
  assertEqual(registry.nest1.nest2.val4(), undefined);
  registry.nest1.nest2.val4 = 4;
  assertEqual(registry.nest1.nest2.val4(), 4);


  // ... including setting values with keys that are nested in novel paths
  assertEqual(registry.novel("meh"), "meh");                      // not yet set
  assertEqual(registry.novel.path.of.keys("meh"), "meh");         // also not yet set
  registry.novel.path.of.keys = 'a secret';                       // just go for it!
  assertEqual(registry.novel.path.of.keys("meh"), "a secret");    // it worked!

  // You can make a new empty registry by passing an empty template, of course:
  const emptyRegistry1 = makeRegistry({});

  // But the first argument is optional.  This is the same as makeRegistry({}).
  const emptyRegistry2 = makeRegistry();
  assertEqual(typeof emptyRegistry2(), 'object');
  assertEqual(Object.keys(emptyRegistry2()).length, 0);

  // Also you can bail out of registry mode any time in the call chain that you wish:
  const simple = makeRegistry({});
  simple.w.x.y.z = 4321;
  assertEqual(simple.w.x.y.z(), simple().w.x.y.z);    // move the parentheses wherever you like

  // ... assuming that you want to lose the other features
  try {
    simple.q.r.s(makeRegistry.exception)
    throw new Error("why was no exception thrown?  that is wrong!");
  } catch (err) {
    assertEqual(err.message, "Key sequence lookup failed (at marked element): (q).r.s");
  }
  try {
    simple().q.r.s
    throw new Error("why was no exception thrown?  that is wrong!");
  } catch (err) {
    // how about a misleading vanilla JS error message?  would that be nice?  fine!
    assertEqual(err.message, "Cannot read property 'r' of undefined");
  }


}
