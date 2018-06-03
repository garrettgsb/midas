import React from 'react';

const Button = ({label, clickAction, inactive}) => {
  return (
    <button className={inactive ? 'inactive' : undefined} onClick={clickAction}>{label}</button>
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

export { Button, Counter };
