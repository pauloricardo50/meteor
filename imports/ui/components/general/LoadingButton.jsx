import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import Button from '/imports/ui/components/general/Button.jsx';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import LoopIcon from 'material-ui/svg-icons/av/loop';
import Scroll from 'react-scroll';

const scroll = () => {
  const options = {
    duration: 350,
    delay: 100,
    smooth: true,
  };
  Scroll.animateScroll.scrollToTop(options);
};

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
      this.setState({ loading: true, isFirstVisit: false }, () => {
        this.props.handleClick();
        Meteor.setTimeout(() => {
          this.setState({ loading: false });
          scroll();
        }, 1500);
      });
    } else {
      scroll();
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
      <Button raised
        // {...this.props}
        label={this.props.label}
        primary={this.state.isFirstVisit}
        onTouchTap={this.handleClick}
        icon={icon}
        disabled={this.props.disabled}
      />
    );
  }
}

LoadingButton.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  value: PropTypes.bool.isRequired,
  link: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

LoadingButton.defaultProps = {
  link: '/app',
  disabled: false,
};
