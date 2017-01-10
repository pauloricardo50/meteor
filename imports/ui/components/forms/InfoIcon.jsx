import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactTooltip from 'react-tooltip'


const styles = {
  a: {
    textDecoration: 'none',
  },
};

export default class InfoIcon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  render() {
    return (
      <a data-tip data-for={this.props.id} style={this.props.style}>
        <span className="fa fa-info-circle fa-lg" />
        <ReactTooltip
          id={this.props.id}
          place="right"
          effect="solid"
          multiline
          border
          class="info-tooltip"
        >
          {this.props.info}
        </ReactTooltip>
      </a>
    );
  }
}

InfoIcon.propTypes = {
  id: PropTypes.string.isRequired,
  style: PropTypes.objectOf(PropTypes.any).isRequired,
  info: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
