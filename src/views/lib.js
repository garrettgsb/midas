import React from 'react';

const Button = ({ label, onClick, inactive, onDelegate }) => {
  if (onDelegate) {
    return <button className={'assigning'} onClick={(event)=>onDelegate(onClick.bind(null, event))}>{label}</button>;
  } else if (!inactive) {
    return <button onClick={onClick}>{label}</button>;
  }
  return <button className={'inactive'}>{label}</button>;
};

const Counter = ({ label, quantity }) => {
  return (
    <div className='counter'>
      <p className='quantity'>{quantity}</p>
      <p className='label'>{label}</p>
    </div>
  );
};

const FillBar = ({ quantity, max, startColor, endColor }) => {
  const fillProgressStyle = {
    height: `${quantity / max * 100}%`,
  };

  if (!startColor) { startColor = {r: 0, g: 0, b: 0}; }
  if (!endColor) { endColor = startColor; }

  const R = startColor.r * (quantity / max) + endColor.r * (1 - (quantity / max));
  const G = startColor.g * (quantity / max) + endColor.g * (1 - (quantity / max));
  const B = startColor.b * (quantity / max) + endColor.b * (1 - (quantity / max));

  fillProgressStyle['backgroundColor'] = `rgb(${R}, ${G}, ${B})`;

  return (
    <div className='fillbar'>
      <div className='fillProgress' style={fillProgressStyle}/>
    </div>
  );
};


const MineReservoirFillBar = ({quantity, max}) => 
  <FillBar quantity={quantity} max={max} startColor={{r:50, g:180, b:100}} />

const FarmWaterFillBar = ({quantity, max}) => 
  <FillBar quantity={quantity} max={max} startColor={{r:24, g:126, b:3}} endColor={{r:204, g:204, b:0}} />

export { Button, Counter, FillBar, MineReservoirFillBar, FarmWaterFillBar, };
