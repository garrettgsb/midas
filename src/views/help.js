import React from 'react';
import { Button, Counter } from './lib';


const ApprenticeBuyPanel = ({onHire}) => {
  return <Button label="Hire Help! 🙋" clickAction={onHire} />;
};

class ApprenticePanel extends React.Component {
  render() {
    var appr = this.props.apprentice;
    var assignButton;
    if (this.props.currentAssignee === appr.id) {
      assignButton = <Button label="Save Assignment" clickAction={this.props.onToggleAssign} />
    } else if (this.props.currentAssignee) {
      assignButton = <Button label="Assign" inactive={true} />
    } else {
      assignButton = <Button label="Assign" clickAction={this.props.onToggleAssign} />
    }
    return (
      <div className='panel'>
        <p className='name'>{appr.name}</p>
        {assignButton}
        <Button label="Act" inactive={!appr.can_act} clickAction={appr.act} />
      </div>
    );
  }
}

export default class Help extends React.Component {
  render() {
    return (
      <div className='container-v'>
        <h1>Help</h1>
        <div className='container help'>
          <ApprenticeBuyPanel onHire={this.props.onHire} />
          {(this.props.apprentices || []).map(appro => (
            <ApprenticePanel
              key={appro.id}
              apprentice={appro}
              currentAssignee={this.props.currentAssignee}
              onToggleAssign={this.props.onAssign.bind(undefined, appro)}
            />
          ))}
        </div>
      </div>
    );
  };
}

