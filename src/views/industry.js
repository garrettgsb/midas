import React from 'react';
import { Button, Counter } from './lib';

export default class Industries extends React.Component {
  constructor(props) {
    super(props);
    this.industries = this.props.industries;
    this.resources = this.props.resources;
  }

  get unlocked() {
    return this.maxGold >= 5;
  }

  render() {
    return this.unlocked ? (
        <div className='container-v'>
          <h1>Industries</h1>
          <div className='container industry'>
            {Object.entries(this.industries).map(industry =>
                <IndustryPanel key={industry[1].name} resources={this.resources} industry={industry[1]} assigning={this.props.assigning}/>
            )}
          </div>
        </div>
    ) : null;
  };
};

class IndustryPanel extends React.Component {
  render() {
    const industry = this.props.industry;
    const resources = this.props.resources;
    const assigning = this.props.assigning;

    if (industry.maxQuantity) {
      return (
        <div className='panel'>
          <Counter label={industry.label} quantity={industry.quantity} />
          <Button
            label='Collect'
            onClick={industry.collect.bind(industry, resources[industry.targetResource])}
            onDelegate={assigning}
          />
          <Counter label='Max' quantity={industry.maxQuantity} />
          <Button
            inactive={industry.canAfford(resources['gold'].quantity)}
            label={`Expand (${industry.costToBuild} Au)`}
            onClick={industry.build.bind(industry, resources['gold'])}
          />
        </div>
      );
    } else {
      return (
        <div className='panel'>
          <Button
            inactive={industry.canAfford(resources['gold'].quantity)}
            label={`Build ${industry.label} (${industry.costToBuild} Au)`}
            onClick={industry.build.bind(industry, resources['gold'])}
          />
        </div>
      );
    }
  };
};
