import autobind from 'autobind-decorator';
import React from 'react';

require('./styles/style.css');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // Mock map objects
      mapIcons: [
        { id: (''+Math.random()).slice(2,10), pos: { x: 10, y: 80 }, color: '#3399BB', icon: '🏠', clickAction: () => alert('You clicked me') },
        { id: (''+Math.random()).slice(2,10), pos: { x: 60, y: 140 }, color: '#99BB33', icon: '⛪️', clickAction: () => alert('You clicked me') },
        { id: (''+Math.random()).slice(2,10), pos: { x: 110, y: 40 }, color: '#BB3399', icon: '🏪', clickAction: () => alert('You clicked me') },
      ],
    };
  }

  render() {
    return (
      <div className='container'>
        <p>🐢</p>
        <Map icons={this.state.mapIcons} />
        {/* <Sidebar>
          <SidebarItem/>
        </Sidebar> */}
      </div>
    );
  }
}

class Map extends React.Component {
  render() {
    return (
      <svg viewBox="0 0 80% 400" xmlns="http://www.w3.org/2000/svg" style={{width: '80%', height: 400}}>
        { this.props.icons.map(icon => <MapIcon key={icon.id} icon={icon}/>) }
      </svg>
    );
  }
}

class MapIcon extends React.Component {
  render() {
    console.log(this.props.icon);
    return (
      <circle cx={this.props.icon.pos.x} cy={this.props.icon.pos.y} r="10" style={{ fill: this.props.icon.color}} />
    )
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
