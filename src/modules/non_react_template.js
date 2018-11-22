//
//  This file is supposed to be a (partial) example of how you can wrap some non-React code, like
//  some code to drive a canvas game, in a react component.  Like if you wanted one of your
//  minigames to be non-React.
//




////////
//
// This is a React component that encapsulates the stuff below
//
////////

import React, {Component} from 'react';

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.game = new ContainedThing();
    this.game.init();
  }

  componentDidMount () {
    const ctx = this.canvas.current.getContext('2d');
    if (ctx) {
      this.game.set({ctx});
      this.game.wake();
    }
  }

  componentWillUnmount() {
    this.game.sleep();
  }

  render() {
    return <canvas ref={this.canvas} style={{width: '800px', height: '600px'}} />
  }
}



////////
//
// This is some non-react code that makes use of the stuff above
//
////////


const settableWhitelistSet = new Set(['ctx', 'hsl']);
const initableWhitelistSet = new Set(['ctx', 'hsl']);

function multiAssign(that, assignments, whitelist) {
  for (var argname in assignments) {
    if (whitelist.has(argname)) {
      that[argname] = assignments[argname];
    }
  }
}

class ContainedThing {
  constructor(args) {
    this.init(args);
    window.aag = this;      // debug cheating!
    this.render = this.render.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  init(args) {
    multiAssign(this, {
      hsl: {h: 0, s: 0, l: 0},
      ctx: null,
      running: true,
    }, initableWhitelistSet);
    multiAssign(this, args, initableWhitelistSet);
  }

  set(args) {
    multiAssign(this, args, settableWhitelistSet);
  }

  wake() {
    this.rendering = true;
    window.addEventListener('mousemove', this.handleInput);
    window.addEventListener('mousedown', this.handleInput);
    window.addEventListener('mouseup', this.handleInput);
    this.render();
  }

  sleep() {
    this.rendering = false;
    window.removeEventListener('mousemove', this.handleInput);
    window.removeEventListener('mousedown', this.handleInput);
    window.removeEventListener('mouseup', this.handleInput);
  }

  handleInput(event) {
  }

  physics() {
  }

  render() {
    if (!this.ctx) { return; }
    this.physics();

    this.rainbowBack();

    if (this.rendering) { requestAnimationFrame(this.render); }
  }


  rainbowBack() {
    this.hsl.h = (this.hsl.h + 1) % 360;
    console.log(this.hsl);

    for (var i = 0; i < this.ctx.canvas.width; i++) {
      let h = (this.hsl.h + i) % 360;
      let s = 58;
      let l = 66;
      this.ctx.fillStyle = `hsl(${h}, 90%, 50%)`;
      //console.log(h, this.ctx.fillStyle);
      //this.ctx.fillStyle = `hsl(${h}, ${s}%, ${l}%)`;
      this.ctx.fillRect(i, 0, 1, this.ctx.canvas.height);
    }
  }

}

