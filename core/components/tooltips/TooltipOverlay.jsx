import React, { Component } from 'react';
import PropTypes from 'prop-types';

import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

import { tooltips } from 'core/arrays/tooltips';
import track from 'core/utils/analytics';

import Tooltip from './Tooltip';

const handleClick = event => event.stopPropagation();

export default class TooltipOverlay extends Component {
  constructor(props) {
    super(props);

    // The hide value is used to signal to react-motion that the component
    // should start to animate out
    // In the Transition component, when it detects a change in hide
    // from false to true, it starts to animate out
    this.state = { hide: false };
  }

  onExit = () => this.setState({ hide: true });
  onEnter = () => this.setState({ hide: false });
  onEntered = id => track('Tooltip - tooltip clicked', { id });

  render() {
    const {
      placement,
      tooltipList,
      match,
      trigger,
      delayShow,
      children,
    } = this.props;
    const tooltipConfig = tooltips(tooltipList)[match.toLowerCase()];

    return (
      <OverlayTrigger
        placement={placement}
        overlay={
          <Tooltip
            placement={placement}
            trigger={trigger}
            tooltipConfig={tooltipConfig}
            hide={this.state.hide}
            match={match}
          />
        }
        rootClose
        animation={false}
        trigger={trigger}
        delayShow={delayShow}
        // onExit={this.onExit}
        // // When clicking the same tooltip multiple times, this is not reset
        // onEnter={this.onEnter}
        onEntered={() => this.onEntered(id)}
        container={global.document !== undefined ? document.body : undefined}
        onClick={handleClick}
      >
        <span className="tooltip-overlay" tabIndex="0">
          {children}
        </span>
      </OverlayTrigger>
    );
  }
}

TooltipOverlay.propTypes = {
  placement: PropTypes.string,
  tooltipList: PropTypes.string.isRequired,
  match: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  trigger: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  delayShow: PropTypes.number,
};

TooltipOverlay.defaultProps = {
  trigger: ['click'], // Can be 'click', 'hover', and/or 'focus'
  placement: 'bottom',
  delayShow: 300,
};
