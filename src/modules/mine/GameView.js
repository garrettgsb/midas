import React, {Component, Fragment} from 'react';

import Active from './Active';
import Strategy from './Strategy';
import Crisis from './Crisis';

class MineGameView extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      subgame: undefined,
    }   

    this.mezzo = this.props.mezzo;
    this.mezzo.forceViewUpdate = this.forceUpdate.bind(this);
  }

  componentDidMount () {
  }

  componentWillUnmount() {
  }

  render () {

    let currentMini = null;
    if (this.state.subgame === 'active') {
      currentMini = <Active />;
    } else if (this.state.subgame === 'strategy') {
      currentMini = <Strategy values={this.props.strategySettings} setValue={this.props.setStrategyValue} />;
    } else if (this.state.subgame === 'crisis') {
      currentMini = <Crisis />;
    }

    return <Fragment>
      <ul>
        <button onClick={() => { this.setState({subgame: undefined});} }>none</button>
        <button onClick={() => { this.setState({subgame: 'active'});} }>Active</button>
        <button onClick={() => { this.setState({subgame: 'strategy'});} }>Strategy</button>
        <button onClick={() => { this.setState({subgame: 'crisis'});} }>Crisis</button>
      </ul>
      {currentMini}
    </Fragment>
  }

}

export default  MineGameView;
