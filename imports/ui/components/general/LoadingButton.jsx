import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import LoopIcon from 'material-ui/svg-icons/av/loop';

export default class LoadingButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFirstVisit: !this.props.value,
      loading: false,
    };
  }

  componentWillUnmount() {
    if (this.timer) {
      Meteor.clearTimeout(this.timer);
    }
  }

  handleClick = () => {
    if (this.state.isFirstVisit) {
      this.setState({ loading: true }, () => {
        this.props.handleClick();
        this.timer = Meteor.setTimeout(() => this.props.history.push(this.props.link), 3000);
      });
    } else {
      this.props.history.push(this.props.link);
    }
  };

  render() {
    let icon = null;
    if (!this.state.isFirstVisit) {
      icon = <CheckIcon />;
    } else if (this.state.loading) {
      icon = <LoopIcon className="fa-spin" />;
    }

    return (
      <RaisedButton
        {...this.props}
        label={this.props.label}
        primary={this.state.isFirstVisit}
        onTouchTap={this.handleClick}
        icon={icon}
      />
    );
  }
}

LoadingButton.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  link: PropTypes.string,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  handleClick: PropTypes.func.isRequired,
};

LoadingButton.defaultProps = {
  link: '/app',
};
