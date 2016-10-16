import React from 'react';

export default class TextInputMoney extends React.Component {

  constructor(props) {
    super(props);
    this.formatToMoney = this.formatToMoney.bind(this);
  }

  formatToMoney() {
    const value = this.value.text;
  }

  render() {
    return (
      <div className="col-sm-10 col-sm-offset-1 animated fadeIn">
        <div className="form-group">
          <label className="control-label" htmlFor={this.props.name}>
            {this.props.label}
          </label>
          <div>
            <input
              type="text"
              className="form-control input-md"
              pattern="[0-9]*"
              name={this.props.name}
              value={this.props.currentValue}
              placeholder={this.props.placeholder}
              onChange={this.formatToMoney}
            />
          </div>
        </div>
      </div>
    );
  }
}
