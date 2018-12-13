import autobind from 'autobind-decorator';

class RelentlessPassageOfTime {
  constructor(config={}) {
    this.subscriptions = [];
    this.config = Object.assign({
      maxDelta_ms: Infinity
    }, config);
    if (config.period_ms) {
      this.procrastinate = () => setTimeout(this.tick, config.period_ms);
    } else {
      this.procrastinate = () => requestAnimationFrame(this.tick);
    }
    this.procrastinate();
  }

  // Argument is a subscriber-callback, with the following signature:
  //      tick(todoT, totalT, deltaT)   -->    scrapsT
  //
  // * todoT is time in ms that should be processed (deltaT + scrapsT)
  // * totalT is the time since the subscription
  // * deltaT is the time since the last invokation
  //
  // If the return value is not (castable to) a number, todoT will be equal to deltaT
  //
  subscribe(cb) {
    let bundle = {
      cb,
      first: performance.now(),
      last: performance.now(),
      scraps: 0,
    };
    this.subscriptions.push(bundle);
    this.oneTick(bundle);
  }

  unsubscribe(cb) {
    this.subscriptions = this.subscriptions.filter(candidate => candidate.cb !== cb);
  }

  @autobind
  tick() {
    for (let sub of this.subscriptions) {
      this.oneTick(sub);
    }
    this.procrastinate();
  }

  // Will call  sub.tick(todoT, totalT, deltaT)      (optionally returning scrapsT)
  oneTick(sub) {
    let now = window.performance.now();
    let totalT = now - sub.first;
    let deltaT = now - sub.last;
    let todoT = deltaT + sub.scraps;
    sub.last = now;
    let scrapsT = sub.cb(todoT, totalT, deltaT);
    sub.scraps = Number(scrapsT) || 0;
  }

}


export default RelentlessPassageOfTime;
