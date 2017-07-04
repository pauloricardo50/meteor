import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionMotion, spring, presets } from 'react-motion';

export default class ColumnTransition extends Component {
  willEnter = () => ({
    width: 0,
    opacity: 1,
    left: 0,
  });

  willLeave = () => ({
    width: spring(0),
    opacity: spring(0),
    left: spring(0),
  });

  getDefaultStyles = () =>
    this.props.properties.map(property => ({
      data: { property },
      key: property.name,
      style: { width: 0, opacity: 1, left: 0 },
    }));

  getStyles = () =>
    this.props.properties.map((property, i) => ({
      data: { property },
      key: property.name,
      style: {
        width: spring(240, presets.gentle),
        opacity: spring(1, presets.gentle),
        left: spring(i * 256, presets.gentle),
      },
    }));

  render() {
    return (
      <div style={{ position: 'absolute' }}>
        <TransitionMotion
          defaultStyles={this.getDefaultStyles()}
          styles={this.getStyles()}
          willLeave={this.willLeave}
          willEnter={this.willEnter}
        >
          {styles => this.props.children(styles)}
        </TransitionMotion>
      </div>
    );
  }
}

ColumnTransition.propTypes = {};
