import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

import { tooltips } from '../../arrays/tooltips';
import Tooltip from './Tooltip/loadable';

class TextWithTooltip extends Component {
  constructor() {
    super();
    this.state = { open: false };
    this.ref = createRef(null);
  }

  toggleOpen = () => this.setState(({ open }) => ({ open: !open }));

  handleClose = () => this.setState({ open: false });

  render() {
    const {
      placement,
      tooltipList,
      match,
      delayShow,
      children,
      tooltipId,
    } = this.props;
    const { open } = this.state;
    const tooltipConfig = tooltipId
      ? { id: tooltipId, double: Array.isArray(tooltipId) }
      : tooltips(tooltipList)[match.toLowerCase()];

    return (
      <>
        <span
          className="text-with-tooltip"
          tabIndex={-1}
          onClick={(event) => {
            // Trigger tooltip instead of another onClick handler in a parent
            event.preventDefault();
            event.stopPropagation();
            this.toggleOpen();
          }}
          ref={this.ref}
        >
          {children}
        </span>
        <Tooltip
          placement={placement}
          tooltipConfig={tooltipConfig}
          match={match}
          open={open}
          anchorRef={this.ref}
          handleClose={this.handleClose}
        />
      </>
    );
  }
}

TextWithTooltip.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  delayShow: PropTypes.number,
  match: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  placement: PropTypes.string,
  tooltipList: PropTypes.string.isRequired,
};

TextWithTooltip.defaultProps = {
  delayShow: 300,
  match: undefined,
  placement: 'bottom',
};

export default TextWithTooltip;
