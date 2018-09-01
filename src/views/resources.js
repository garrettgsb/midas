import React from 'react';
import { Button, Counter } from './lib';

const Resources = ({resources}) => {
  return (
    <div className='container-v'>
      <h1>Resources</h1>
      <div className='container'>
        {resources.entries.map(resourceEntry => {
            return <ResourcePanel
              key={resourceEntry.name}
              resource={resourceEntry}
            />
          })
        }
      </div>
    </div>
  );
};

class ResourcePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.refs.transTarget && Object.keys(this.props.resource.transmutationTargets).length > 0) {
      const firstTarget = this.refs.transTarget.value || '';
      this.setState({transmuteTarget: firstTarget});
    }
  }

  dropdownChange(e) {
    this.setState({transmuteTarget: e.target.value});
  }

  render() {
    const resource = this.props.resource;
    return (
      <div className='panel'>
        <h2>{resource.label}</h2>
        <div>{resource.quantity}</div>
      </div>
    );
  }


  old_render() {
    const {resource, resources, transmute} = this.props;
    const currentTransmuteTarget = this.state.transmuteTarget;
    return (
      <div className='panel'>
        <Counter label={resource.label} quantity={resource.quantity} />
        {resource.name === 'gold' && <p>{`Total produced: ${resource.produced}`}</p>}
        {
          resource.find &&
          <Button
            label={`${resource.verb} (${resource.findVolume})`}
            onClick={resource.find}
            onDelegate={this.props.assigning}
          />
        }
        {
          Object.keys(resource.transmutationTargets).length > 0 &&
          <div className='transmute-box'>
            <Button
              inactive={!resource.canTransmuteTo(resources[this.state.transmuteTarget])}
              label={'Transmute to...'}
              onClick={ transmute.bind(null, resource, resources[currentTransmuteTarget]) }
              onDelegate={this.props.assigning}
            />
            <select ref='transTarget' onChange={(e) => this.dropdownChange(e)}>
              {Object.entries(resource.transmutationTargets).map(target => {
                const [name, value] = target;
                return (<option key={name} value={name}>{`${resources[name].label} (${value})`}</option>)
              })}
            </select>
          </div>
        }
      </div>
    );
  };
}

export default Resources;
