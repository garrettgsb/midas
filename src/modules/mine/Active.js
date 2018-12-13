import React, {Component, Fragment} from 'react';
import _ from 'lodash';
import autobind from 'autobind-decorator';

import RPOT from '../../lib/rpot';

const rockTypes = [
  { name: 'sky', color: 'skyblue', },
  { name: 'sand', color: 'sandybrown', },
];

for (let rockID in rockTypes) { rockTypes[rockID].id = rockID; }


export default class MineActiveReact extends Component {

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.dim = { x: 600, y: 300 };
    this.init();
  }

  get canvas() {
    return this.canvasRef.current;
  }

  componentDidMount () {
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      window.addEventListener('mousedown', this.onClick);
      this.wake(ctx);
    } else {
      console.error("can't wake up (wake me up inside)");
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.onClick);
    this.sleep();
  }

  render() {
    return (<canvas ref={this.canvasRef} width={this.dim.x} height={this.dim.y} style={{width: this.dim.x + 'px', height: this.dim.y + 'px'}} />);
  }


  /////// Non-React game stuff below this line  ////////

  init() {
    this.state = {
      ctx: null,
      running: false,
      hsl: {h: 37, s: 100, l: 47},
      field: _.times(this.dim.y, () => new Array(this.dim.x).fill(0)),
      dirtyColumns: new Set(_.range(this.dim.x)),
    };
    this.initField(this.state.field);
    this.rpot = new RPOT();
  }

  wake(ctx) {
    this.rpot.subscribe(this.tick);
    this.state.ctx = ctx;
    this.state.running = true;
    this.renderFrame();
  }

  sleep() {
    this.rpot.unsubscribe(this.tick);
    this.state.running = false;
  }


  initField(field) {
    for (let y in field) {
      for (let x in field[y]) {
        x = Number(x);
        y = Number(y);

        field[y][x] = 1;
        if (y < 30) {
          field[y][x] = 0;
        }
        if (x === 10 && y === 10) {
          field[y][x] = 1;
        }
      }
    }
  }

  @autobind
  onClick(event) {
    if (event.target === this.canvas) {
      event.preventDefault();
      event.stopPropagation();
      let x = event.offsetX;
      for (var y = 0; y < this.canvas.height; y++) {
        if (this.state.field[y][x]) {
          this.state.field[y][x] = 0;
          this.state.dirtyColumns.add(x);
          break;
        }
      }
    }
  }

  


  @autobind
  tick(todoT, totalT, deltaT) {     // should return scrapsT
    console.log(todoT)
  }

  @autobind
  renderFrame() {
    let ctx = this.state.ctx;
    if (!ctx) { return; }


    for (var x = 0; x < ctx.canvas.width; x++) {
      if (this.state.dirtyColumns.has(x)) {
        ctx.fillStyle = rockTypes[0].color;
        ctx.fillRect(x, 0, 1, ctx.canvas.height);
        for (var y = 0; y < ctx.canvas.height; y++) {
          if (this.state.field[y][x]) {
            ctx.fillStyle = rockTypes[this.state.field[y][x]].color;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        this.state.dirtyColumns.delete(x);
      }
    }

    if (this.state.running) { requestAnimationFrame(this.renderFrame); }
  }

}


