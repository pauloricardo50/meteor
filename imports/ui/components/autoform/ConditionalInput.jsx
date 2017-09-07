import PropTypes from 'prop-types';
import React, { Component } from 'react';

import FormValidator from './FormValidator';

export default class ConditionalInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      conditional: false,
    };
  }

  // Set the state of the conditional on load
  componentDidMount() {
    this.setConditional(this.props.children[0].props.currentValue);
  }

  onConditionalChange = event => {
    // Make sure boolean values are treated as booleans
    const value = event.target.value;
    let safeValue = value;
    if (value === 'true') {
      safeValue = true;
    } else if (value === 'false') {
      safeValue = false;
    }

    this.setConditional(safeValue);
  };

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
    const conditionalChildren = React.Children
      .toArray(this.props.children)
      .slice(1);
    return (
      <div
        className="form-group"
        style={{ ...this.props.style, position: 'relative' }}
      >
        {React.cloneElement(
          // The conditional input
          this.props.children[0],
          { onConditionalChange: this.onConditionalChange, noValidator: true },
        )}
        {this.state.conditional
          ? // The hidden elements that will appear if the conditional input is true
            <div className="animated fadeIn">
              {/* Don't show a validator for conditional child elements */}
              {React.Children.map(conditionalChildren, child =>
                React.cloneElement(child, { noValidator: true }),
              )}
            </div>
          : ''}
        <FormValidator {...this.props} id={this.props.children[0].id} />
      </div>
    );
  }
}

ConditionalInput.propTypes = {
  conditionalTrueValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
    .isRequired,
  children: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  ),
};
