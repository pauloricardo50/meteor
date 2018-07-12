import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LayoutError from './LayoutError';
import RootError from './RootError';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Remove error if user switches page
  // If it crashes again then it will simply go through componentDidCatch
  componentWillReceiveProps({ pathname }) {
    if (this.state.hasError && pathname !== this.props.pathname) {
      this.setState({ hasError: false, error: null });
    }
  }

  componentDidCatch(error) {
    // Error should also log to kadira
    this.setState({ hasError: true, error });
    const Kadira = { window };
    if (Kadira) {
      Kadira.trackError('react', error.stack.toString());
    }
  }

  render() {
    const { children, helper } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      switch (helper) {
      case 'layout':
        return <LayoutError error={error} />;
      case 'app':
        return (
          <LayoutError
            error={error}
            style={{ width: '100%', height: '100%' }}
          />
        );
      case 'root':
        return <RootError error={error} />;
      default:
        return <React.Fragment>Woops!</React.Fragment>;
      }
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  helper: PropTypes.string.isRequired,
  pathname: PropTypes.string,
  children: PropTypes.node.isRequired,
};

ErrorBoundary.defaultProps = {
  pathname: undefined,
};
