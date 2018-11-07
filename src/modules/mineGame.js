import autobind from 'autobind-decorator';
import React from 'react';

require('../styles/style.css');
require('./mineGame.css');

export default class MineGame extends React.Component {
  render() {
    return (
      <div className='mine-game-area'>
        <button>Mine</button>
        <button>Prospect</button>
      </div>
    );
  }
}
