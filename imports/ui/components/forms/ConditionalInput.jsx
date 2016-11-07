import React, { Component, PropTypes } from 'react';

export default class ConditionalInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conditional: false,
    };

    this.onConditionalChange = this.onConditionalChange.bind(this);
  }

  // Set the state of the conditional on load
  componentDidMount() {
    this.setConditional(this.props.children[0].props.currentValue);
  }

  onConditionalChange(event) {
    // If the event's value matches the one that is correct, change state to true
    // Convert to string to allow booleans and strings to be used as the conditionalTrueValue
    this.setConditional(event.target.value);
  }

  setConditional(value) {
    if (value === this.props.conditionalTrueValue) {
      this.setState({
        conditional: true,
      });
    } else {
      this.setState({
        conditional: false,
      });
    }
  }

  render() {
    return (
      <div className="form-group">
        {React.cloneElement(
          // The conditional input
          this.props.children[0],
          { onConditionalChange: this.onConditionalChange }
        )}
        {this.state.conditional ?
          // The hidden elements that will appear if the conditional input is true
          <div className="animated fadeIn">{this.props.children.slice(1)}</div> :
          ''
        }
      </div>
    );
  }
}


ConditionalInput.propTypes = {
  conditionalTrueValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  children: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ])),
};
