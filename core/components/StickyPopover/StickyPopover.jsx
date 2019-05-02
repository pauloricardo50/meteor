import React from 'react';
import PropTypes from 'prop-types';
import Overlay from 'react-bootstrap/lib/Overlay';
import Popover from 'react-bootstrap/lib/Popover';

export default class PopoverStickOnHover extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showPopover: false };
    this.timeout = null;
    this.ref = React.createRef();
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  handleMouseEnter = () => {
    const { delay, onMouseEnter } = this.props;

    this.timeout = setTimeout(() => {
      this.setState({ showPopover: true }, () => {
        if (onMouseEnter) {
          onMouseEnter();
        }
      });
    }, delay);
  };

  handleMouseLeave = () => {
    clearTimeout(this.timeout);
    this.setState({ showPopover: false });
  };

  render() {
    const { component, children, placement, title } = this.props;
    const { showPopover } = this.state;

    const enhancedChildren = React.Children.map(children, child =>
      React.cloneElement(child, {
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        ref: this.ref,
      }))[0];

    return (
      <React.Fragment>
        {enhancedChildren}
        <Overlay
          show={showPopover}
          placement={placement}
          target={this.ref.current}
          shouldUpdatePosition
        >
          <Popover
            onMouseEnter={() => this.setState({ showPopover: true })}
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
  onMouseEnter: undefined,
  placement: 'right',
  title: null,
};

PopoverStickOnHover.propTypes = {
  children: PropTypes.element.isRequired,
  component: PropTypes.node.isRequired,
  delay: PropTypes.number,
  onMouseEnter: PropTypes.func,
  placement: PropTypes.string,
  title: PropTypes.node,
};
