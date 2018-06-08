import React from 'react';

const Button = ({label, clickAction, inactive, assigning}) => {
  if (assigning) {
    return <button className={'assigning'} onClick={(event)=>assigning(clickAction.bind(null, event))}>{label}</button>
  } else if (!inactive) {
    return <button onClick={clickAction}>{label}</button>
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
