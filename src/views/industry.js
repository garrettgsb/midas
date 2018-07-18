import autobind from 'autobind-decorator';
import React from 'react';
import { Button, Counter, FillBar } from './lib';

export default class Industries extends React.Component {
  constructor(props) {
    super(props);
    this.industries = this.props.industries;
    this.resources = this.props.resources;
  }

  render() {
    const helperPanels = {
      mine: MinePanel,
    }
    return (
      <div className='container-v'>
        <h1>Industries</h1>
        <div className='container industry'>
          {this.industries.map((model, i) => {
            // TODO: This loop should probably be polymorphic. Either IndustryPanel figures out
            // what to render, or the model itself holds a component, which it renders.
            if (!model.visible) {
              return null;
            } else if (!model.tier) {
              return <BuyIndustryButton key={model.key} model={model} name={model.name} enabled={model.canUpgrade} />;
            } else {
              // at this point it must be visible, and have a tier > 0
              const Helper = helperPanels[model.type];
              if (!Helper) throw "oh god wat";    // TODO: better plan
              return <Helper
                key={i}
                resources={this.resources}
                model={model}
              />;
              // TODO: apprentice assigning shit?
            }
          })}
        </div>
      </div>
    );
  }
}

class MinePanel extends React.Component {

  @autobind
  dropdownChange(e) {
    this.props.model.target = e.target.value;
  }

  render() {
    const model = this.props.model;
    const resources = this.props.resources;
    let quantityMined = null;
    if (!model._target) {
      return (
        <div className='panel'>
          <div className='container'>
            <div className='container-v'>
              Choose a resource, mortal:
              <select onChange={this.dropdownChange}>
                <option key='sdfsdfsdfsdfsdfsd' value={undefined}>CHOOSE:</option>
                {model.possibleTargets.map(({name, label}) => (<option key={name} value={name}>{label}</option>))}
              </select>
            </div>
          </div>
        </div>
      );
    } else {
      if (model._target && model._target.name && model._produced[model._target.name]) {
        quantityMined = model._produced[model._target.name];
      }
      return (
        <div className='panel'>
          <div className='container'>
            <div className='container-v'>
              <p>Reservoir: {model.reservoir}</p>
              <p>Mined: {quantityMined}</p>
              <Button label="Mine" onClick={model.mine} inactive={!model.target} />
              <Button label="Prospect" onClick={model.prospect} inactive={!model.target} />
              <select onChange={this.dropdownChange}>
                {model.possibleTargets.map(({name, label}) => (<option key={name} value={name}>{label}</option>))}
              </select>
            </div>
            <div className='container-v'>
              <FillBar quantity={model.reservoir} max={model._reservoirSize}/>
            </div>
          </div>
        </div>
      );
    }
  }
}

const BuyIndustryButton = ({model}) => {
  return (
    <div className='panel'>
      <div>{model.label}</div>
      <Button
        label={`Buy (${model.upgradeCost} ð)`}
        inactive={!model.canUpgrade}
        onClick={model.upgrade}
      />
    </div>
  )
};
