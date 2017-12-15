import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import Button from 'core/components/Button';
import Icon from '/imports/ui/components/general/Icon';

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
    }
  };

  render() {
    const { isFirstVisit, loading } = this.state;
    let icon = null;
    if (!isFirstVisit) {
      icon = <Icon type="check" />;
    } else if (loading) {
      icon = <Icon type="loop-spin" />;
    }

    return (
      <Button
        raised
        // {...this.props}
        label={this.props.label}
        primary={isFirstVisit}
        onClick={this.handleClick}
        icon={icon}
        disabled={this.props.disabled || (!loading && !isFirstVisit)}
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
