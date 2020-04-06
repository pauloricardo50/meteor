import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class AutoFormConditionalInput extends Component {
  constructor(props) {
    super(props);
    this.state = { conditional: false };
  }

  // Set the state of the conditional on load
  componentDidMount() {
    this.setConditional(this.props.children[0].props.inputProps.currentValue);
  }

  onConditionalChange = value => {
    // Make sure boolean values are treated as booleans
    let safeValue = value;
    if (value === 'true') {
      safeValue = true;
    } else if (value === 'false') {
      safeValue = false;
    }

    this.setConditional(safeValue);
  };

  // If the event's value matches the one that is correct, change state to true
  setConditional = value =>
    this.setState({ conditional: value === this.props.conditionalTrueValue });

  render() {
    const { children, style } = this.props;
    const conditionalChildren = React.Children.toArray(children).slice(1);
    return (
      <div className="form-group" style={{ ...style, position: 'relative' }}>
        {React.cloneElement(
          // The conditional input
          children[0],
          {
            inputProps: {
              // Merge with old props because React.cloneElement only uses
              // a shallow merge here
              ...children[0].props.inputProps,
              onConditionalChange: this.onConditionalChange,
            },
          },
        )}
        {this.state.conditional ? (
          // The hidden elements that will appear if the conditional input is true
          <div className="animated fadeIn">
            {/* Don't show a validator for conditional child elements */}
            {React.Children.map(conditionalChildren, child =>
              React.cloneElement(child, {
                inputProps: child.props.inputProps,
              }),
            )}
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

AutoFormConditionalInput.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  ),
  conditionalTrueValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
    .isRequired,
};
