import { Meteor } from 'meteor/meteor';

import React, { Component } from 'react';

export const STATUS = {
  ERROR: 'ERROR',
  VALID: 'VALID',
  HIDE: 'HIDE',
  TODO: 'TODO',
};

const SAVING_ANIMATION_DURATION_MS = 900;

export default WrappedComponent =>
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        status: this.getStatus(),
      };

      this.timer = null;
    }

    componentWillReceiveProps({ saving: nextSaving }) {
      // If the animation is going on, don't trigger this again
      if (this.timer) {
        return;
      }

      const { saving } = this.props;

      if (saving === false && nextSaving === true) {
        // If saving is happening, hide the icon, and then make it reappear
        this.setState({ status: STATUS.HIDE }, () => {
          this.timer = Meteor.setTimeout(() => {
            Meteor.clearTimeout(this.timer);
            this.timer = null;
          }, SAVING_ANIMATION_DURATION_MS);

          this.setState({ status: this.getStatus() });
        });
      }
    }

    getStatus = () => {
      const { error, required, value, todo } = this.props;

      if (error) {
        return STATUS.ERROR;
      }
      if (
        todo
        || (required === true && [undefined, '', null].includes(value))
      ) {
        return STATUS.TODO;
      }

      return STATUS.VALID;
    };

    render() {
      const { status } = this.state;
      return <WrappedComponent {...this.props} status={status} />;
    }
  };
