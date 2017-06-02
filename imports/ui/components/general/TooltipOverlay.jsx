import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { tooltips, tooltipsById } from '/imports/js/arrays/tooltips';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from './Tooltip.jsx';

const styles = {
  span: {
    borderBottom: 'dashed 1px #aaaaaa',
    cursor: 'help',
    position: 'relative',
  },
};

export default class TooltipOverlay extends Component {
  constructor(props) {
    super(props);

    // The hide value is used to signal to react-motion that the component
    // should start to animate out
    // In the Transition.jsx component, when it detects a change in hide
    // from false to true, it starts to animate out
    this.state = { hide: false };
  }

  render() {
    const { placement, id, list, match, trigger, children } = this.props;

    return (
      <OverlayTrigger
        placement={placement}
        overlay={
          <Tooltip
            placement={placement}
            trigger={trigger}
            id={id ? tooltipsById(id) : tooltips(list)[match.toLowerCase()]}
            hide={this.state.hide}
          />
        }
        rootClose
        trigger={trigger}
        onExit={() => this.setState({ hide: true })}
        // When clicking the same tooltip multiple times, this is not reset
        onEnter={() => this.setState({ hide: false })}
      >
        <span style={styles.span} tabIndex="0">
          {children}
        </span>
      </OverlayTrigger>
    );
  }
}

TooltipOverlay.propTypes = {};
