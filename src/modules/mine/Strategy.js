import React, {Component, Fragment} from 'react';

export default class MineStrategy extends Component {
  constructor(props) {
    super(props);
    this.setResource = this.setResource.bind(this);
    this.setPeriod = this.setPeriod.bind(this);
    this.setQuantity = this.setQuantity.bind(this);
  }


  setResource(event) {
    //console.log(event.target.textContent);
    this.props.setValue('resource', event.target.textContent.toLowerCase());
  }

  setPeriod(event) {
    this.props.setValue('period', event.target.value);
  }

  setQuantity(event) {
    this.props.setValue('quantity', event.target.value);
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
        <input onChange={this.setPeriod} type="number" value={this.props.values.period} />
      </li>
      <li>
        <label>Quantity</label>
        <input onChange={this.setQuantity} type="number" value={this.props.values.quantity} />
      </li>
    </ul>
  }
}

