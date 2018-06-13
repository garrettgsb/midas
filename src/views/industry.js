import React from 'react';
import { Button, Counter } from './lib';

export default class Industries extends React.Component {
  constructor(props) {
    super(props);
    this.industries = this.props.industries;
    this.onBuild = this.props.onBuild;
  }

  render() {
    return (
        <div className='container-v'>
          <h1>Industries</h1>
          <div className='container industry'>
            {Object.entries(this.industries).map(industry => <IndustryPanel industry={industry[1]}/>)}
          </div>
        </div>
    );
  };
};

class IndustryPanel extends React.Component {
  render() {
    const industry = this.props.industry;
    return (
      <div className='panel'>
        <Counter label={industry.label} quantity={industry.quantity} />
        <Counter label='Max' quantity={industry.maxQuantity} />
          <Button
            label='Expand'
            clickAction={industry.build.bind(industry)}
          />
      </div>
    );
  };
};
