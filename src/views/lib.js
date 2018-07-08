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

const FillBar = ({ quantity, max }) => {
  const fillProgressStyle = {
    height: `${quantity / max * 100}%`,
  };

  return (
    <div className='fillbar'>
      <div className='fillProgress' style={fillProgressStyle}/>
    </div>
  );
};

export { Button, Counter, FillBar };
