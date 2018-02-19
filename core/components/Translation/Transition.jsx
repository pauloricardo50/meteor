import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, spring } from 'react-motion';

// Stiff spring
const s1 = value => spring(value, { stiffness: 1000, damping: 10 });

// Softer spring
const s2 = value => spring(value, { stiffness: 200, damping: 10 });

const styles = {
  willEnter: { scale: 0.9, opacity: 0.5 },
  steady: { scale: 1, opacity: 1 },
  willLeave: { scale: 1.1, opacity: 0 },
};

export default class Transition extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    this.setState({ items: [{ key: 'a', ...styles.steady }] });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hide === false && nextProps.hide === true) {
      this.setState({ items: [] });
    }
  }

  // Styles to interpolate from on mount
  willEnter = () => styles.willEnter;

  // Styles to interpolate to on dismount
  willLeave = () => ({
    scale: s1(styles.willLeave.scale),
    opacity: s2(styles.willLeave.opacity),
  });

  render() {
    const { items } = this.state;

    return (
      <TransitionMotion
        willLeave={this.willLeave}
        willEnter={this.willEnter}
        styles={items.map(item => ({
          key: item.key,
          style: { scale: s1(item.scale), opacity: s2(item.opacity) },
        }))}
      >
        {interpolatedStyles => (
          <span>
            {interpolatedStyles.map(config => this.props.children(config))}
          </span>
        )}
      </TransitionMotion>
    );
  }
}

Transition.propTypes = {
  hide: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired,
};
