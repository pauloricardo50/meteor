import React from 'react';
import PropTypes from 'prop-types';
import Overlay from 'react-bootstrap/lib/Overlay';
import Popover from 'react-bootstrap/lib/Popover';

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
      }))[0];

    return (
      <React.Fragment>
        {enhancedChildren}
        <Overlay
          show={show}
          placement={placement}
          target={this.ref.current}
          shouldUpdatePosition
          transition={null}
          animation={null}
          // trigger={['hover', 'focus', 'click']}
        >
          <Popover
            onMouseEnter={this.handleMousePopoverEnter}
            onMouseLeave={this.handleMouseLeave}
            title={title}
            onClick={e => e.stopPropagation()}
          >
            {component}
          </Popover>
        </Overlay>
      </React.Fragment>
    );
  }
}

PopoverStickOnHover.defaultProps = {
  delay: 0,
  exitDelay: 100,
  onMouseEnter: undefined,
  placement: 'right',
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
