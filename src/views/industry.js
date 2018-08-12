import autobind from 'autobind-decorator';
import React from 'react';
import { Button, Counter, FillBar, FarmWaterBar } from './lib';

export default class Industries extends React.Component {
  constructor(props) {
    super(props);
    this.industries = this.props.industries;
    this.resources = this.props.resources;
  }

  render() {
    const helperPanels = {
      mine: MinePanel,
      mill: MillPanel,
      farm: FarmPanel,
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
              return <UnboughtIndustryPanel key={model.key} model={model} name={model.name} enabled={model.canUpgrade} />;
            } else {
              // at this point it must be visible, and have a tier > 0
              const Helper = helperPanels[model.type];
              if (!Helper) throw `Invalid model type <<${model.type}>>, cannot render`;    // TODO: better plan
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
  render() {
    const model = this.props.model;
    return (
      <IndustryPanelLayout model={model}>
        <div className='container-v'>
          <Button label="Mine" onClick={model.mine} inactive={!model.target} />
          <Button label={`Prospect (${model.prospectCost} ð)`} onClick={model.prospect} inactive={!model.target} />
        </div>
        <div className='container-v'>
          <FillBar quantity={model.reservoir} max={model._reservoirSize}/>
        </div>
      </IndustryPanelLayout>
    );
  }
}

class MillPanel extends React.Component {
  render() {
    const model = this.props.model;
    return (
      <IndustryPanelLayout model={model}>
        <ul>
          {model.buttons && model.buttons.map(({label, active}, idx) => (
            <Button label={label}  key={model.target+''+idx} onClick={model.mill.bind(model, idx)} inactive={!(model.target && active)} />
          ))}
        </ul>
      </IndustryPanelLayout>
    );
  }
}

class FarmPanel extends React.Component {
  render() {
    const model = this.props.model;
    return (
      <IndustryPanelLayout model={model}>
        <div className='container-v'>
          <Button label="Water" onClick={model.water} inactive={!model.target} />
        </div>
        <div className='container-v'>
          <FarmWaterBar quantity={model._currentReservoir} max={model._maxReservoir}/>
        </div>
      </IndustryPanelLayout>
    );
  }
}

const TargetlessIndustryPanel = ({model, dropdownChange}) => {
  return (
    <div className='panel'>
      <h2>{model.label}</h2>
      <div className='container'>
        <div className='container-v'>
          Choose a resource, mortal:
          <select onChange={dropdownChange}>
            <option key='arbitrary_nonsense_gjsdfkiwnbijdfksdugj' value={undefined}>CHOOSE:</option>
            {model.possibleTargets.map(({name, label}) => (<option key={name} value={name}>{label}</option>))}
          </select>
        </div>
      </div>
    </div>
  );
}

const UnboughtIndustryPanel = ({model}) => {
  return (
    <div className='panel'>
      <h2>{model.label}</h2>
      <Button
        label={`Buy (${model.upgradeCost} ð)`}
        inactive={!model.canUpgrade}
        onClick={model.upgrade}
      />
    </div>
  )
};

const IndustryPanelLayout = ({model, children}) => {
  if (!model.target) {
    return <TargetlessIndustryPanel model={model} dropdownChange={(e) => model.handleTargetChange(e.target.value)} /> ;
  } else {
    const quantityProduced = (model.target.name && model._produced[model.target.name]);
    return (
      <div className='panel'>
        <div className='container-v' style={{margin: 0}}>
          <h2>{model.label}</h2>
          <div>Produced: {quantityProduced}</div>
          <div>{model.reservoir !== undefined ? "Reservoir: " + model.reservoir : ""}</div>
        </div>
        <div className='container'>
          {children}
        </div>
        { model.possibleTargets ? (
            <select onChange={(e) => model.handleTargetChange(e.target.value)}>
              {model.possibleTargets.map(({name, label}) => (
                <option key={name} value={name} {...{selected: name===model.target.name}} >{label}</option>
              ))}
            </select>
        ) : null}
      </div>
    );
  }
}

