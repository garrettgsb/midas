import autobind from 'autobind-decorator';

class RelentlessPassageOfTime {
  constructor(config={}) {
    this.subscribers = [];
    if (config.period_ms) {
      this.procrastinate = () => setTimeout(this.tick, config.period_ms);
    } else {
      this.procrastinate = () => requestAnimationFrame(this.tick);
    }
    this.procrastinate();
  }

  // Argument is a "subscriber".  Subscriber should have a method like this:
  //      sub.tick(todoT, sumT, deltaT)      (optionally returning scrapsT)
  // If sub.tick does not return scrapsT, then todoT will be equal to deltaT
  subscribe(sub) {
    let bundle = {
      sub,
      first: performance.now(),
      last: performance.now(),
      scraps: 0,
    };
    this.subscribers.push(bundle);
    this.oneTick(bundle);
  }

  unsubscribe(sub) {
    this.subscribers = this.subscribers.filter(candiate => candidate !== sub);
  }

  @autobind
  tick() {
    for (let sub of this.subscribers) {
      this.oneTick(sub);
    }
    this.procrastinate();
  }

  // Will call  sub.tick(todoT, sumT, deltaT)      (optionally returning scrapsT)
  oneTick(sub) {
    let now = window.performance.now();
    let sumT = now - sub.first;
    let deltaT = now - sub.last;
    let todoT = deltaT + sub.scraps;
    sub.last = now;
    let scrapsT = sub.sub.tick(todoT, sumT, deltaT);
    sub.scraps = Number(scrapsT) || 0;
  }

}


export default RelentlessPassageOfTime;
