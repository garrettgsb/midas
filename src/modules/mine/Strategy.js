import React, {Component, Fragment} from 'react';
import autobind from 'autobind-decorator';

export default class MineStrategy extends Component {
  constructor(props) {
    super(props);
  }


  @autobind
  setResource(event) {
    //console.log(event.target.textContent);
    this.props.setValue('resource', event.target.textContent.toLowerCase());
  }

  @autobind
  setPeriod(event) {
    this.props.setValue('period', Number(event.target.value) || 0);
  }

  @autobind
  setQuantity(event) {
    this.props.setValue('quantity', Number(event.target.value) || 0);
  }

  render() {
    return <ul>
      <li>
        <label>Resource</label>
        <button onClick={this.setResource} >Lead</button>
        <button onClick={this.setResource} >Tin</button>
      </li>
      <li>
        <label>Time To Mine (sec)</label>
        <input onBlur={this.setPeriod} type="number" defaultValue={this.props.values.period} />
      </li>
      <li>
        <label>Quantity</label>
        <input onBlur={this.setQuantity} type="number" defaultValue={this.props.values.quantity} />
      </li>
    </ul>
  }
}

