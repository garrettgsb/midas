import autobind from 'autobind-decorator';

class RelentlessPassageOfTime {
  constructor(config) {
    this.firstTime = this.lastTime = window.performance.now();
    this.subscribers = [];
    requestAnimationFrame(this.tick);     // TODO: configurable to obey other schedules
  }

  @autobind
  tick() {
    for (let sub of this.subscribers) {
      let now = window.performance.now();
      let delta = now - this.lastTime;
      let scraps = sub.sub.tick(sub.scraps + delta, delta, now - this.firstTime);
      sub.scraps = Number(scraps) || 0;
    }
    requestAnimationFrame(this.tick);     // TODO: configurable to obey other schedules
  }

  subscribe(sub) {
    this.subscribers.push({
      sub,
      scraps: 0,
    });
  }
}


export default RelentlessPassageOfTime;
