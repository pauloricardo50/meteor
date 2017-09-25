import React, { Component } from 'react';
import PropTypes from 'prop-types';

import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';

import { tooltips, tooltipsById } from '/imports/js/arrays/tooltips';
import track from '/imports/js/helpers/analytics';

import Tooltip from './Tooltip';

const handleClick = (event) => {
  console.log('hey!');
  event.stopPropagation();
};

export default class TooltipOverlay extends Component {
  constructor(props) {
    super(props);

    // The hide value is used to signal to react-motion that the component
    // should start to animate out
    // In the Transition component, when it detects a change in hide
    // from false to true, it starts to animate out
    this.state = { hide: false };
  }

  render() {
    const {
      placement,
      id,
      pureId,
      list,
      match,
      trigger,
      delayShow,
      children,
    } = this.props;
    const tooltipId = id || tooltips(list)[match.toLowerCase()];

    return (
      <OverlayTrigger
        placement={placement}
        overlay={
          <Tooltip
            placement={placement}
            trigger={trigger}
            id={tooltipId}
            pureId={pureId}
            hide={this.state.hide}
            match={match}
          />
        }
        rootClose
        animation={false}
        trigger={trigger}
        delayShow={delayShow}
        onExit={() => this.setState({ hide: true })}
        // When clicking the same tooltip multiple times, this is not reset
        onEnter={() => this.setState({ hide: false })}
        onEntered={() => track('Tooltip - tooltip clicked', { tooltipId })}
        container={document.body}
        onClick={handleClick}
      >
        <span
          // className="tooltip-overlay hvr-underline-from-center"
          className="tooltip-overlay"
          tabIndex="0"
        >
          {children}
        </span>
      </OverlayTrigger>
    );
  }
}

TooltipOverlay.propTypes = {
  placement: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  pureId: PropTypes.bool,
  list: PropTypes.string.isRequired,
  match: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  trigger: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  delayShow: PropTypes.number,
};

TooltipOverlay.defaultProps = {
  trigger: ['click'], // Can be 'click', 'hover', and/or 'focus'
  placement: 'bottom',
  pureId: false,
  delayShow: 300,
};
