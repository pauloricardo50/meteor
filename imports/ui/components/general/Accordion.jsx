import React, { Component, PropTypes } from 'react';

export default class Accordion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: this.props.isActive,
      styles: {
        height: 0,
        overflow: 'hidden',
        transition: '500ms ease-in-out',
        opacity: 0,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isActive: nextProps.isActive,
      styles: {
        height: nextProps.isActive ? `${this.content.clientHeight}px` : 0,
        overflow: nextProps.isActive ? 'none' : 'visible',
        transition: '500ms ease-in-out',
        opacity: nextProps.isActive ? 1 : 0,
      },
    });
  }

  render() {
    return (
      <div
        className="Accordion-container"
        style={this.state.styles}
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
  isActive: PropTypes.bool.isRequired,
  children: PropTypes.objectOf(PropTypes.any).isRequired,
};
