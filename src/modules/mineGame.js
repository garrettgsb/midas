import autobind from 'autobind-decorator';
import React from 'react';

require('./mineGame.css');

export default class MineGame extends React.Component {

  constructor(props) {
    super(props);
    this.playing = false;
    this.lastUpdate = null;
    this.x_coord = 100;
    this.x_vel = 10;
    this.backgroundColors = ['red', 'orange', 'yellow', 'green'];
    this.bgIndex = 0;
    this.baller = true;
  }

  paint() {
    this.ctx.fillStyle = this.backgroundColors[this.bgIndex];
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    if (this.baller) {
      this.ctx.fillStyle = 'white';
      this.ctx.beginPath();
      this.ctx.arc(this.x_coord, 10, 40, 0, 6);
      this.ctx.fill();
      this.ctx.stroke();
    }

  }

  @autobind
  doFrame() {
    if (this.lastUpdate && (Date.now() - this.lastUpdate > 100)) {
      this.x_coord += this.x_vel;
      if (this.x_coord > 300) {
        this.x_vel = -10;
      }
      if (this.x_coord < 100) {
        this.x_vel = 10;
      }
      // TODO: something visible
      this.lastUpdate = Date.now();
    } else if (!this.lastUpdate) {
      this.lastUpdate = Date.now();
    }

    this.paint();

    if (this.playing) {
      requestAnimationFrame(this.doFrame);
    }
  }

  @autobind
  bgInc() {
    this.bgIndex = (this.bgIndex + 1) % this.backgroundColors.length;
    console.log("fuck");
  }

  componentDidMount() {
    const canvas = this.refs.canvas;
    this.ctx = canvas.getContext('2d');

    this.playing = true;
    this.doFrame();


    // canvas.addEventListener('click', this.bgInc)
  }

  componentWillUnmount () {
    this.playing = false;

    // this.ctx.canvas.removeEventListener('click', this.bgInc);
  }

  render() {
    return (
      <div className='mine-game-area'>
        <canvas onClick={this.bgInc} id='mine-game' ref='canvas' style={{width:'400px', height:'400px'}}>:O</canvas>
      </div>
    );
  }
}
