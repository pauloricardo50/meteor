import React, { Component } from 'react';
import PropTypes from 'prop-types';

export const STATUS = {
  ERROR: 'ERROR',
  VALID: 'VALID',
  HIDE: 'HIDE',
  TODO: 'TODO',
};

const ValidIconContainer = WrappedComponent =>
  class ValidIconContainerHOC extends Component {
    constructor(props) {
      super(props);
      this.state = {
        status: this.getStatus(),
      };
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.saving === false && nextProps.saving === true) {
        // If saving is happening, hide the icon, and then make it reappear
        this.setState({ status: STATUS.HIDE }, () =>
          this.setState({ status: this.getStatus() }));
      }
    }

    getStatus = () => {
      const { error, required, value } = this.props;

      if (error) {
        return STATUS.ERROR;
      } else if (required === true && [undefined, '', null].includes(value)) {
        return STATUS.TODO;
      }

      return STATUS.VALID;
    };

    render() {
      const { status } = this.state;
      return <WrappedComponent {...this.props} status={status} />;
    }
  };

export default ValidIconContainer;
