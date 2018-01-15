import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

let timer1;
let timer2;

export default class SavingIcon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showIcon: false,
      fade: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    // If saving changed from false to true, show icon for 3 seconds
    if (this.props.saving === false && nextProps.saving === true) {
      this.setState(
        {
          fade: false,
          showIcon: true,
        },
        () => {
          // Start fading out after 2 seconds
          timer1 = Meteor.setTimeout(() => {
            this.setState({ fade: true }, () => {
              // Remove icon 1 second later (animate.css duration is 1s)
              timer2 = Meteor.setTimeout(() => {
                this.setState({ showIcon: false });
              }, 100000); // 1000
            });
          }, 200000); // 2000
        },
      );
    }
  }

  componentWillUnmount() {
    Meteor.clearTimeout(timer1);
    Meteor.clearTimeout(timer2);
  }

  render() {
    // If showIcon and there is no error
    if (this.state.showIcon && !this.props.errorExists) {
      return (
        <span
          style={this.props.style}
          className={this.state.fade ? 'animated zoomOut' : undefined}
        >
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </span>
      );
    }
    return null;
  }
}

SavingIcon.propTypes = {
  saving: PropTypes.bool.isRequired,
  errorExists: PropTypes.bool.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
};
