import React from 'react';
import { Button, Counter } from './lib';

export default class Debug extends React.Component {
  constructor(props) {
    super(props);
    this.open = false;
  }

  toggle() {
    this.open = !this.open;
  }

  render() {
    const open = this.open ? '' : 'closed';
    return (
        <div className={`debug ${open}`}>
            <p className='toggle' onClick={() => this.toggle()}>{this.open ? '𝐗' : '🐛'}</p>
        </div>
    );
  };
};
