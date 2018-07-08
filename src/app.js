import autobind from 'autobind-decorator';
import React from 'react';

import bind_resources from './models/resources.js';
import bind_items from './models/items';
import Apprentice from './models/apprentices.js';
import bind_industries from './models/industries';

import Debug from './views/debug.js';
import Resources from './views/resources';
import Shop from './views/shop';
import Help from './views/help';
import Industry from './views/industry';
import Alchemy from './views/alchemy';

require('./styles/style.css');

window.debug = window.debug || { hax: true };      // debugging hackery

class App extends React.Component {
  constructor() {
    super();
    const fu = this.forceUpdate.bind(this);
    this.state = {
      RPOT: new RelentlessPassageOfTime(fu),
      resources: {},
      items: {},
      industries: {},
      apprentices: [],
      maxGold: 0,
      amAssigning: false,
    };
    this.state.items = bind_items(fu, this.state);
    this.state.resources = bind_resources(fu, this.state);
    this.state.industries = bind_industries(fu, this.state);
    this.state.resources.lead.quantity = 5;
    this.state.RPOT.run();

    // debugging hackery
    window.globalState = this.state;
  }

  @autobind
  hireApprentice() {
    this.setState({ apprentices: [...this.state.apprentices, new Apprentice(this.state.RPOT)] });
  }

  transmute(from, to) {
    if (from.transmute(to)) {
      to.quantity += 1;
    }
  }

  @autobind
  assign_toggle(appr) {
    if (!this.state.amAssigning) {
      this.setState({
        amAssigning: appr,
        pending_assignment: [],
      });
    } else {
      this.assign_finish(appr, this.state.pending_assignment);
      this.setState({
        amAssigning: false,
        pending_assignment: [],
      });
    }
  }

  assign_finish(appr, proposed_assignments) {
    appr.assign(proposed_assignments);
  }

  @autobind
  assign_append(fn) {
    this.setState({ pending_assignment: [...this.state.pending_assignment, fn] });
  }

  componentWillUpdate() {
    const [current, max] = [this.state.resources.gold.quantity, this.state.maxGold];
    if (Math.max(current, max) !== this.state.maxGold) {
      this.setState({ maxGold: Math.max(current, max) });
    }
  }

  render() {
    return (
      <div className='container-v'>
        { window.debug.hax && <Debug/> }
        <Resources
          amAssigning={this.state.amAssigning}
          assign_append={this.assign_append}
          resources={this.state.resources}
          transmute={this.transmute}
        />
        <Shop
          items={Object.values(this.state.items)}
        />
        <Help
          apprentices={this.state.apprentices}
          onHire={this.hireApprentice}
          onAssign={this.assign_toggle}
          currentAssignee={this.state.amAssigning.id}
        />
        <Industry
          industries={this.state.industries}
          resources={this.state.resources}
          assigning={this.state.amAssigning ? this.assign_append : undefined}
        />
        <Alchemy />
      </div>
    );
  }
}

class RelentlessPassageOfTime {
    constructor(forceUpdate) {
        this.forceUpdate = forceUpdate;
        this.subscribers = [];
    }

    run() {
        const _run = this.run.bind(this);
        const requireUpdate = this.subscribers.reduce((acc, subscriber) => subscriber.tick(window.performance.now()) || acc, false);
        if (requireUpdate) this.forceUpdate();
        requestAnimationFrame(_run);
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }
}

export default App;
