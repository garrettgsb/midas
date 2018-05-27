import React from 'react';
import { Lead, Gold } from './resources.js';
import { LeadCatalyst, MetalDetector } from './items.js';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      resources: {
        lead: new Lead(this.forceUpdate.bind(this)),
        gold: new Gold(this.forceUpdate.bind(this)),
      },
      items: []
    };
    this.state.resources.lead.setQuantity(10);
    this.state.items.push(new LeadCatalyst(this.forceUpdate.bind(this), this.state.resources));
    this.state.items.push(new MetalDetector(this.forceUpdate.bind(this), this.state.resources));
  }

  transmute(from, to) {
    if (from.transmute(to)) {
      to.incrementBy(1);
    }
  }

  render() {
    return (
      <div className='container-v'>
        <div className='container'>
          {Object.values(this.state.resources).map(resource => {
            return <ResourcePanel key={resource.name} resource={resource} resources={this.state.resources} transmute={this.transmute} />
          })}
        </div>
            <Shop items={this.state.items} />
      </div>
    );
  };
};

class ResourcePanel extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    if (this.refs.transTarget && Object.keys(this.props.resource.transmutationTargets).length > 0) {
      const firstTarget = this.refs.transTarget.value || '';
      this.setState({transmuteTarget: firstTarget});
    }
  }

  dropdownChange(e) {
    this.setState({transmuteTarget: e.target.value});
  }

  render() {
    const {resource, resources, transmute} = this.props;
    return (
      <div className='panel'>
        <Counter label={resource.label} quantity={resource.quantity} />
        {resource.find &&
          <Button label={`${resource.verb} (${resource.findVolume})`} clickAction={resource.find}/>
        }
        {
          Object.keys(resource.transmutationTargets).length > 0 &&
          <div className='transmute-box'>
            <Button label={'Transmute to...'} clickAction={() => {
              transmute(resource, resources[this.state.transmuteTarget])
            }}/>
            <select ref={'transTarget'} onChange={(e) => this.dropdownChange(e)}>
              {Object.entries(resource.transmutationTargets).map(target => {
                const [name, value] = target;
                return (<option key={name} value={name}>{`${resources[name].label} (${value})`}</option>)
              })}
            </select>
          </div>
        }
      </div>
    );
  };
}

const Button = ({label, clickAction}) => {
  return (
    <button onClick={clickAction}>{label}</button>
  );
};

const Counter = ({label, quantity}) => {
  return (
    <div className='counter'>
      <p className='quantity'>{quantity}</p>
      <p className='label'>{label}</p>
    </div>
  );
};

class Shop extends React.Component {
  render() {
    return (
      <div className='container-v'>
        <h1>Shop</h1>
        <div className='container shop'>
          {this.props.items.map(item => {
            return (<ShopItem key={item.name} item={item} />);
          })}
        </div>
      </div>
    );
  };
};

const ShopItem = ({item}) => {
  const {name, label, description, price} = item;
  return (
    <div className='shop-item'>
      <p className='label'>{label}</p>
      <p className='description'>{description}</p>
      <div>
        <p className='price'>{price}</p>
        <Button label='Buy' clickAction={item.buy.bind(item)} />
      </div>
    </div>
  );
};


export default App;
