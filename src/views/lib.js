import React from 'react';

const Button = ({label, onClick, inactive, onDelegate}) => {
  if (onDelegate) {
    return <button className={'assigning'} onClick={(event)=>onDelegate(onClick.bind(null, event))}>{label}</button>
  } else if (!inactive) {
    return <button onClick={onClick}>{label}</button>
  } else {
    return <button className={'inactive'}>{label}</button>
  }
};

const Counter = ({label, quantity}) => {
  return (
    <div className='counter'>
      <p className='quantity'>{quantity}</p>
      <p className='label'>{label}</p>
    </div>
  );
};

export { Button, Counter };
