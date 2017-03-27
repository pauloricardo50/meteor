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
    // Make sure boolean values are treated as booleans
    const value = event.target.value;
    let safeValue = value;
    if (value === 'true') {
      safeValue = true;
    } else if (value === 'false') {
      safeValue = false;
    }

    this.setConditional(safeValue);
  }

  setConditional(value) {
    // If the event's value matches the one that is correct, change state to true
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
      <div className="form-group" style={this.props.style}>
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
