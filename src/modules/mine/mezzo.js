import React from 'react';

import ResourcePool from '../../resourcePool';

import MineGameView from './GameView.js';



export default class MineMezzo {
  constructor(eso) {
    this.eso = eso;
    this.strategySettings = {
      resource: 'lead',
      period: 10,
      quantity: 0,
    }
    this.forceViewUpdate = () => console.error("not initialized, this is bad");   // GameView should override
  }



  overworldTick(sumT, deltaT, accumT) {  // returns processedT
  }

  updateStrategySettings(key, value) {
    if (key === 'resource' && ResourcePool.resourceNames.includes(value)) {
      this.strategySettings.resource = value;
    } else if (['period', 'quantity'].includes(key)) {
      this.strategySettings[key] = value;
    }

    this.forceViewUpdate()
  }


  getView() {
    this.mgv = React.createElement(MineGameView, {
      mezzo: this,
      strategySettings: this.strategySettings,
      setStrategyValue: this.updateStrategySettings.bind(this),
    });

    window.mgv = this.mgv;      // DIRTY HACK FOR DEBUGGING AND STUFF

    return (() => this.mgv);
  }

}


