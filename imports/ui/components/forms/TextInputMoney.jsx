import React from 'react';

export default class TextInputMoney extends React.Component {

  constructor(props) {
    super(props);
    this.formatToMoney = this.formatToMoney.bind(this);
  }

// Prevents people from entering characters other than numbers, and formats value with apostrophes
  formatToMoney(event) {
    this.input.value = this.input.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  }

  render() {
    return (
      <div className="form-group">
        <label className="control-label" htmlFor={this.props.id}>
          {this.props.label}
        </label>
        <div className="input-group">
          <div className="input-group-addon">CHF</div>
          <input
            ref={(c) => { this.input = c; }}
            type="text"
            className="form-control"
            pattern="[0-9]*"
            id={this.props.id}
            value={this.props.currentValue}
            placeholder={this.props.placeholder}
            onChange={() => {
              this.formatToMoney();
              if (this.props.onChange() !== undefined) {
                this.props.onChange();
              }
            }}
          />
        </div>
      </div>
    );
  }
}
