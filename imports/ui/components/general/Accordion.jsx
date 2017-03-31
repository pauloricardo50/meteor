import React, { Component, PropTypes } from 'react';

export default class Accordion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: this.props.isActive,
      styles: {
        height: 0,
        overflow: 'hidden',
        transition: '500ms cubic-bezier(.02, .01, .47, 1)',
        opacity: 0,
      },
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    };

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
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

  handleResize() {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    });
  }

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
