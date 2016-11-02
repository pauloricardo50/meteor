import React from 'react';

import TextField from 'material-ui/TextField';


export default class TextInputNumber extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      textValue: this.props.currentValue,
    };

    this.formatToNumber = this.formatToNumber.bind(this);
  }

// Prevents people from entering characters other than numbers, and formats value with apostrophes
  formatToNumber(e) {
    this.setState({
      textValue: e.target.value.replace(/\D/g, ''),
    });
  }

  render() {
    return (
      <div className="form-group">
        {/* <label className="control-label" htmlFor={this.props.id}>
          {this.props.label}
        </label>
        <div className="input-group">
          <input
            ref={(c) => { this.input = c; }}
            type="text"
            className="form-control"
            pattern="[0-9]*"
            id={this.props.id}
            value={this.props.currentValue}
            placeholder={this.props.placeholder}
            onChange={() => {
              this.formatToNumber();
              (typeof this.props.onChange === 'function') ? this.props.onChange : () => { return undefined; };
            }}
          />
        </div> */}
        <TextField
          floatingLabelText={this.props.label}
          hintText={this.props.placeholder}
          value={this.state.textValue}
          type="text"
          id={this.props.id}
          onChange={(e) => {
            this.formatToMoney(e);
            (typeof this.props.onChange === 'function') ? this.props.onChange : () => { return undefined; };
          }}
          fullWidth
        />
      </div>
    );
  }
}

TextInputNumber.propTypes = {
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string.isRequired,
  currentValue: React.PropTypes.string,
  onChange: React.PropTypes.func,
};
