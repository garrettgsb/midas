import autobind from 'autobind-decorator';
import React from 'react';

require('./styles/style.css');

class App extends React.Component {
  constructor() {
    super();
    this.toggleModal = () => this.setState(prev => ({ theModalIsOpen: !prev.theModalIsOpen }));
    this.state = {
      // Mock map objects
      items: [
        { id: (''+Math.random()).slice(2,10), pos: { x: 10, y: 80 }, color: '#3399BB', icon: '🏠', clickAction: this.toggleModal, modalData: 'A house' },
        { id: (''+Math.random()).slice(2,10), pos: { x: 60, y: 140 }, color: '#99BB33', icon: '⛪️', clickAction: this.toggleModal, modalData: 'A church' },
        { id: (''+Math.random()).slice(2,10), pos: { x: 110, y: 40 }, color: '#BB3399', icon: '🏪', clickAction: this.toggleModal, modalData: 'A 24 store' },
      ],
      theModalIsOpen: true,
    };
  }

  @autobind
  changeModalTo(id) {

  }

  render() {
    return (
      <div className='container'>
        <Map items={this.state.items} />
        <Sidebar items={this.state.items} />
        <TheModal isOpen={this.state.theModalIsOpen} />
      </div>
    );
  }
}

class Map extends React.Component {
  render() {
    return (
      <svg viewBox="0 0 80 400" xmlns="http://www.w3.org/2000/svg" style={{width: '80%', height: 400}}>
        { this.props.items.map(item => <MapIcon key={item.id} item={item}/>) }
      </svg>
    );
  }
}

class MapIcon extends React.Component {
  render() {
    const { color, icon, pos, clickAction } = this.props.item;
    return (
      <circle onClick={clickAction} cx={pos.x} cy={pos.y} r="10" style={{ fill: color }}>
        {icon} {/* TODO: Make this show up */}
      </circle>
    )
  }
}

class Sidebar extends React.Component {
  render() {
    return (
      <div className='container-v'>
        { this.props.items.map(item => <SidebarItem item={item} />) }
      </div>
    )
  }
}

class SidebarItem extends React.Component {
  render() {
    const { color, icon, clickAction } = this.props.item;
    return (
      <div onClick={clickAction} className='sidebar-item' style={{backgroundColor: color, minWidth: '100px'}}>
        <p>🐢</p>
      </div>
    );
  }
}

class TheModal extends React.Component {
  render() {
    return (
      <div className={`the-modal ${this.props.isOpen ? '' : 'hidden'}`}>
        <p>🐢</p>
      </div>
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
