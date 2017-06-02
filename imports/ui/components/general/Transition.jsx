import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TransitionMotion, spring } from 'react-motion';

const s1 = value => spring(value, { stiffness: 500, damping: 10 });
const s2 = value => spring(value, { stiffness: 200, damping: 10 });

export default class Transition extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    this.setState({
      items: [{ key: 'a', scale: 1, opacity: 1 }],
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hide === false && nextProps.hide === true) {
      this.setState({ items: [] });
    }
  }

  willLeave() {
    return { scale: s2(1.1), opacity: s2(0) };
  }

  willEnter() {
    return { scale: 0.9, opacity: 0 };
  }

  render() {
    return (
      <TransitionMotion
        willLeave={this.willLeave}
        willEnter={this.willEnter}
        defaultStyles={this.state.items.map(item => ({
          key: item.key,
          style: { scale: 0.9, opacity: 0 },
        }))}
        styles={this.state.items.map(item => ({
          key: item.key,
          style: {
            scale: s1(item.scale),
            opacity: s2(item.opacity),
          },
        }))}
      >
        {interpolatedStyles => (
          <span>
            {interpolatedStyles.map(config => {
              return this.props.children(config);
            })}
          </span>
        )}

      </TransitionMotion>
    );
  }
}

Transition.propTypes = {};
