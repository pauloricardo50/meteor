import React from 'react';

export default class TextInputMoney extends React.Component {

  constructor(props) {
    super(props);
    this.formatToMoney = this.formatToMoney.bind(this);
  }

// Prevents people from entering characters other than numbers, and formats value with apostrophes
  formatToMoney() {
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
              (typeof this.props.onChange === 'function') ? this.props.onChange : () => { return undefined; };
            }}
          />
        </div>
      </div>
    );
  }
}

TextInputMoney.propTypes = {
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  currentValue: React.PropTypes.string,
  onChange: React.PropTypes.func,
};
