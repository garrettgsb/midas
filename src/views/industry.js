import React from 'react';
import { Button, Counter, FillBar } from './lib';

export default class Industries extends React.Component {
  constructor(props) {
    super(props);
    this.industries = this.props.industries;
    this.resources = this.props.resources;
  }

  render() {
    return (
      <div className='container-v'>
        <h1>Industries</h1>
        <div className='container industry'>
          {Object.entries(this.industries).map(model => {
            // TODO: This loop should probably be polymorphic. Either IndustryPanel figures out
            // what to render, or the model itself holds a component, which it renders.
            if (model[1].type === 'mine') {
              return <MinePanel key={model[1].name} resources={this.resources} model={model[1]} assigning={this.props.assigning}/>;
            } // Else farm, mill...
          })}
        </div>
      </div>
    );
  }
}

class MinePanel extends React.Component {
  render() {
    const model = this.props.model;
    const resources = this.props.resources;
    if (model.state.purchased) {
      return (
        <div className='panel container'>
          <div className='container-v'>
            <p>Resevoir: {model.resevoir}</p>
            <p>Mined: {model.state.quantity}</p>
            <Button label="Mine" onClick={model.mine}/>
            <Button label="Prospect" onClick={model.prospect}/>
          </div>
          <div className='container-v'>
            <FillBar quantity={model.resevoir} max={model.state.resevoirSize}/>
          </div>
        </div>
      );
    }
    return (
      <div className='panel'>
        <Button
          inactive={model.canAfford(resources['gold'].quantity)}
          label={`Build ${model.label} (${model.costToBuild} Au)`}
          onClick={model.build}
        />
      </div>
    );
  }
}
