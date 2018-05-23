import React from 'react';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      resources: {
        lead: 10,
        gold: 0,
      },
      exchangeRates: {
        gold: {
          lead: 10
        }
      }
    };
  }

  xToY(from, to, rate, quantity) {
    const resources = this.state.resources;
    if (resources[from] - (rate * quantity) >= 0) {
      resources[from] -= rate * quantity;
      resources[to] += quantity;
    }
    this.setState(resources);
  }

  incResource(resource, quantity) {
    const resources = this.state.resources;
    resources[resource] += quantity;
    this.setState(resources);
  }

  render() {
    return (
      <div className='container-v'>
        <div className='container'>
          <ResourcePanel
            label='Lead'
            quantity={this.state.resources.lead}
            buttons={
              [
                {label: 'Find', clickAction: () => this.incResource('lead', 1)}
              ]
            }/>
            <ResourcePanel
              label='Gold'
              quantity={this.state.resources.gold}
              buttons={
                [
                  {label: 'Transmute', clickAction: () => this.xToY('lead', 'gold', this.state.exchangeRates.gold.lead, 1)},
                ]
              }/>
        </div>
            <Shop />
      </div>
    );
  };
};

const ResourcePanel = ({label, quantity, buttons}) => {
  return (
    <div className='panel'>
      <Counter label={label} quantity={quantity} />
      {buttons && buttons.map(button => {
        return <Button key={button.label} label={button.label} clickAction={button.clickAction} />
      })}
    </div>
  );
};

const Button = ({label, clickAction}) => {
  return (
    <div>
      <button onClick={clickAction}>{label}</button>
    </div>
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
            <ShopItem name='Lead Catalyst' description='Reduces the amount of lead necessary to create gold' price={100}  />
        </div>
      </div>
    );
  };
};

const ShopItem = ({name, description, price}) => {
  return (
    <div className='shop-item'>
      <p className='label'>{name}</p>
      <p className='description'>{description}</p>
      <p className='price'>{price}</p>
      <Button label='Buy' clickAction={() => console.log('lol nah')} />
    </div>
  );
};


export default App;
