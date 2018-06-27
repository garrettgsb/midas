import React from 'react';
import { Button, Counter } from './lib';

export default class Shop extends React.Component {
  get unlocked() {
    return this.props.appState.maxGold >= 10;
  }

  render() {
    return this.unlocked ?
    (
      <div className='container-v'>
        <h1>Shop</h1>
        <div className='container shop'>
          {this.props.items.map(item => {
            return (<ShopItem key={item.name} item={item} />);
          })}
        </div>
      </div>
    ) : null;
  };
};

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
