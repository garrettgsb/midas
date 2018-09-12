import React from 'react';
import { Button } from './lib';

export default class Shop extends React.Component {
  render() {
    if (! _.some(this.props.items.map(item => item.unlocked))) {
      return null;
    }
    return (
      <div className='container-v'>
        <h1>Shop</h1>
        <div className='container shop'>
          {this.props.items
            .filter(item => item.unlocked)
            .map(item => {
              return (<ShopItem key={item.name} item={item} />);
            })}
        </div>
      </div>
    );
  }
}

const ShopItem = ({item}) => {
  const {name, label, description, price} = item;
  return (
    <div className='shop-item'>
      <p className='label'>{label}</p>
      <p className='description'>{description}</p>
      <div>
        <p className='price'>{price.gold}</p>
        <Button inactive={!item.canAfford} label='Buy' onClick={item.buy.bind(item)} />
      </div>
    </div>
  );
};
