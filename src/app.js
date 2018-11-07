import autobind from 'autobind-decorator';
import React from 'react';
import MineGame from './modules/mine/mineGame.js';
import Economy from './economy';

require('./styles/style.css');

// TODO: This is a placeholder object for some other part of the app,
// maybe like some of those slick models that we've been working on.
// Or maybe a Redux store, if we're into that.
const somewhereElse = {
  mine: {
    resources: [
      {
        label: 'Gold',
        icon: '🌕',
        quantity: 0,
      },
      {
        label: 'Silver',
        icon: '☄️',
        quantity: 0,
      },
      {
        label: 'Aluminium',
        icon: '📎',
        quantity: 0,
      },
    ]
  }
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      economy: new Economy(),
      modalTarget: null,
    };
  }

  @autobind
  changeModalTo(id) {
    this.setState(prev => ({modalTarget: id === prev.modalTarget ? null : id}));
  }

  render() {
    const modalItem = this.state.economy.getSidebarItems().find(item => item.id === this.state.modalTarget);      // TODO: WRONG USE OF SIDEBAR ITEMS, yOU RUBE
    return (
      <div className='game-main'>
        <Map items={this.state.economy.getMapItems()} onClick={this.changeModalTo} />
        <Sidebar items={this.state.economy.getSidebarItems()} onClick={this.changeModalTo} />
        {this.state.modalTarget ? <TheModal eso={modalItem} /> : null}
      </div>
    );
  }
}

class Map extends React.Component {
  render() {
    return (
      <div className='map'>
        { /* I think we probably want to eventually move away from SVG, but this is fine. */ }
        <svg className='map-svg' onClick={ (e) => this.props.onClick(null) } xmlns="http://www.w3.org/2000/svg" >
          { this.props.items.map(item =>
              <MapIcon key={item.id} item={item} onClick={ (e) => this.props.onClick(item.id) } />
          ) }
        </svg>
      </div>
    );
  }
}

class MapIcon extends React.Component {
  render() {
    const { id, color, icon, pos, clickAction } = this.props.item;
    return (
      <circle onClick={(e) => {
        e.stopPropagation();
        this.props.onClick();
      }}
      cx={pos.x}
      cy={pos.y}
      r="10"
      style={{ fill: color }}>
        {icon} {/* TODO: Make this show up */}
      </circle>
    );
  }
}

class Sidebar extends React.Component {
  render() {
    return (
      <div className='sidebar container-v' style={{border: '1px solid black'}}>
        { this.props.items.map(item => <SidebarItem key={item.id} item={item} onClick={this.props.onClick.bind(null, item.id)} />) }
      </div>
    );
  }
}

class SidebarItem extends React.Component {
  render() {
    const { id, color, icon, clickAction, buttonLabel } = this.props.item;
    return (
      <div onClick={this.props.onClick} className='sidebar-item' style={{backgroundColor: color, minWidth: '100px'}}>
        <p>{icon} {buttonLabel} {icon}</p>
      </div>
    );
  }
}

class TheModal extends React.Component {
  render() {
    const { eso } = this.props;
    const ContainedView = eso.getView && eso.getView();
    if (ContainedView) {
      return (
        <div className={`the-modal`} style={{backgroundColor: eso.color}}>
          <ContainedView />
        </div>
      );
    }
    return (
      <div className={`the-modal`} style={{backgroundColor: eso.color}}>
        <h1>{eso.buttonLabel}</h1>
      </div>
    );
  }
}


class MineModal extends React.Component {
  render() {
    const mine = somewhereElse.mine;
    return (
      <div className='mine-modal'>
        <div className='header'></div>
        <div className='resource-list'>
          { mine.resources.map(resource => {
            return (
              <div key={resource.icon} className='resource-list-item'>
                <div>{resource.icon}</div>
                <div>{resource.label}</div>
                <div>{resource.quantity}</div>
              </div>
            );
          })}

        </div>
        <div className='transfer-area'>
          { /* TODO: You can exchange resources with wagons here. */ }
          <img className='wagon' src='wagon.png'/>
        </div>
        <MineGame/>
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
