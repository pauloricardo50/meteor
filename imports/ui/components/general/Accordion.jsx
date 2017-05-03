import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Accordion extends Component {
  constructor(props) {
    super(props);

    const active = this.props.isActive;

    this.state = {
      isActive: active,
      styles: {
        height: 0,
        overflow: active ? 'unset' : 'hidden',
        transition: '500ms cubic-bezier(.02, .01, .47, 1)',
        opacity: active ? 1 : 0,
      },
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);

    if (this.props.isActive && this.content) {
      this.setState(prevState => ({
        styles: { ...prevState.styles, height: `${this.content.clientHeight}px` },
      }));
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isActive: nextProps.isActive,
      styles: {
        height: nextProps.isActive ? `${this.content.clientHeight}px` : 0,
        overflow: nextProps.isActive ? 'unset' : 'hidden',
        transition: '500ms cubic-bezier(.02, .01, .47, 1)',
        opacity: nextProps.isActive ? 1 : 0,
      },
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    });
  };

  render() {
    // Deep copy state
    let adjustedStyles = JSON.parse(JSON.stringify(this.state.styles));
    if (this.state.styles.height !== 0) {
      adjustedStyles.height = `${this.content.clientHeight}px`;
    }
    return (
      <div
        className="Accordion-container"
        style={adjustedStyles}
        ref={c => {
          this.container = c;
        }}
      >
        <div
          className="Accordion-content"
          ref={c => {
            this.content = c;
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

Accordion.propTypes = {
  isActive: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};
