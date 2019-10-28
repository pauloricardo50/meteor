import React from 'react';
import PropTypes from 'prop-types';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';

export default class PopoverStickOnHover extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showPopover: false };
    this.enterTimeout = null;
    this.exitTimeout = null;
    this.ref = React.createRef();
  }

  componentWillUnmount() {
    if (this.enterTimeout) {
      clearTimeout(this.enterTimeout);
    }
    if (this.exitTimeout) {
      clearTimeout(this.exitTimeout);
    }
  }

  handleMouseEnter = () => {
    const { delay, onMouseEnter } = this.props;

    clearTimeout(this.exitTimeout);
    this.enterTimeout = setTimeout(() => {
      this.setState({ showPopover: true }, () => {
        if (onMouseEnter) {
          onMouseEnter();
        }
      });
    }, delay);
  };

  handleMousePopoverEnter = () => {
    clearTimeout(this.exitTimeout);
    this.setState({ showPopover: true });
  };

  handleMouseLeave = () => {
    const { exitDelay } = this.props;

    clearTimeout(this.enterTimeout);
    this.exitTimeout = setTimeout(() => {
      this.setState({ showPopover: false });
    }, exitDelay);
  };

  render() {
    const { component, children, placement, title, forceOpen } = this.props;
    const { showPopover } = this.state;
    const show = forceOpen || showPopover;

    const enhancedChildren = React.Children.map(children, child =>
      React.cloneElement(child, {
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        ref: this.ref,
        onFocus: this.handleMouseEnter,
        onBlur: this.handleMouseLeave,
        showPopover,
      }))[0];

    return (
      <>
        {enhancedChildren}
        <Popper
          open={show}
          anchorEl={this.ref.current}
          placement={placement}
          onMouseEnter={this.handleMousePopoverEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={e => e.stopPropagation()}
        >
          <Paper style={{ padding: 8 }} elevation={15} className="popover-content">
            {title && <h4 style={{ marginTop: 0 }}>{title}</h4>}
            {component}
          </Paper>
        </Popper>
      </>
    );
  }
}

PopoverStickOnHover.defaultProps = {
  delay: 0,
  exitDelay: 100,
  onMouseEnter: undefined,
  placement: 'right-start',
  title: null,
};

PopoverStickOnHover.propTypes = {
  children: PropTypes.element.isRequired,
  component: PropTypes.node.isRequired,
  delay: PropTypes.number,
  exitDelay: PropTypes.number,
  onMouseEnter: PropTypes.func,
  placement: PropTypes.string,
  title: PropTypes.node,
};
