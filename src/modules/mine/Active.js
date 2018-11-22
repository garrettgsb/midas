import React, {Component, Fragment} from 'react';
import autobind from 'autobind-decorator';

export default class MineActiveReact extends Component {

  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.init();
  }

  componentDidMount () {
    const ctx = this.canvas.current.getContext('2d');
    if (ctx) {
      this.wake(ctx);
    } else {
      console.log("can't wake up (wake me up inside)");
    }
  }

  componentWillUnmount() {
    this.sleep();
  }

  render() {
    return (<canvas ref={this.canvas} style={{width: '800px', height: '600px'}} />);
  }


  /////// Non-React game stuff below this line  ////////

  init() {
    this.state = {
      ctx: null,
      running: false,
    };
  }

  wake(ctx) {
    this.state.ctx = ctx;
    this.state.running = true;
    this.state.hsl = {h: 0, s: 0, l: 0};
    this.doFrame();
  }

  sleep() {
    this.state.running = false;
  }

  @autobind
  doFrame() {
    if (!this.state.ctx) { return; }
    //this.physics();

    this.rainbowBack(this.state.ctx);

    if (this.state.running) { requestAnimationFrame(this.doFrame); }
  }


  rainbowBack(ctx) {
    this.state.hsl.h = (this.state.hsl.h + 1) % 360;

    for (var i = 0; i < ctx.canvas.width; i++) {
      let h = (this.state.hsl.h + i) % 360;
      let s = 58;
      let l = 66;
      ctx.fillStyle = `hsl(${h}, 90%, 50%)`;
      //console.log(h, ctx.fillStyle);
      //ctx.fillStyle = `hsl(${h}, ${s}%, ${l}%)`;
      ctx.fillRect(i, 0, 1, ctx.canvas.height);
    }
  }


}


