import React from 'react';

export default class RadioInput extends React.Component {

  constructor(props) {
    super(props);
    // Set initial state to be the 2nd option
    this.state = {
      value: this.props.values[this.props.values.default],
    };
    this.setValue = this.setValue.bind(this);
  }

  setValue(e) {
    this.setState({
      value: e.target.value,
    });
  }

// TODO: Refactor this into a map function which takes the values array
  render() {
    return (
      <div className="form-group">
        <label>{this.props.label}</label><br />
        <div className="radio-inline">
          <label>
            <input
              type="radio"
              value={this.props.values[0]}
              onClick={this.setValue}
              checked={this.state.value === this.props.values[0]}
              onChange={this.props.onChange}
            />
            {this.props.values[0]}
          </label>
        </div>
        <div className="radio-inline">
          <label>
            <input
              type="radio"
              value={this.props.values[1]}
              onClick={this.setValue}
              checked={this.state.value === this.props.values[1]}
              onChange={this.props.onChange}
            />
            {this.props.values[1]}
          </label>
        </div>
      </div>
    );
  }
}

RadioInput.propTypes = {
  label: React.PropTypes.string.isRequired,
  values: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  default: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func,
};
