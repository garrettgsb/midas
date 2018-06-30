import React from 'react';
import { Button, Counter } from './lib';

export default class Alchemy extends React.Component {
  get unlocked() {
    return this.maxGold > 50;
  }
  render() {
    return this.unlocked ? (
      <div className='container-v'>
        <h1>Alchemy</h1>
        <div className='container alchemy'>
          <p>Research!</p>
        </div>
      </div>
    ) : null;
  };
};
