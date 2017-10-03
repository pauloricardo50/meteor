import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LayoutError from './LayoutError';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  componentDidCatch(error, info) {
    // Error should also log to kadira
    console.log('componentDidCatch!');
    console.log('error: ', error);
    console.log('info: ', info);
    this.setState({ hasError: true });
  }

  // Remove error if user switches page
  // If it crashes again then it will simply go through componentDidCatch
  componentWillReceiveProps({ pathname }) {
    if (this.state.hasError && pathname !== this.props.pathname) {
      this.setState({ hasError: false, errorMessage: '' });
    }
  }

  render() {
    const { children, helper } = this.props;
    const { hasError, errorMessage } = this.state;
    const errorProps = { ...this.props, errorMessage };

    if (hasError) {
      switch (helper) {
        case 'layout':
          return <LayoutError {...errorProps} />;
        default:
          return <div>Woops!</div>;
      }
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  helper: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
