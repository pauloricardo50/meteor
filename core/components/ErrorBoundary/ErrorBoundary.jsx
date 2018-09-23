import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SlackService from 'core/api/slack';
import LayoutError from './LayoutError';
import RootError from './RootError';
import withErrorCatcher from '../../utils/withErrorCatcher';

class ErrorBoundary extends Component {
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

  sendToKadira = (error) => {
    // Error should also log to kadira
    const { Kadira } = window;
    if (Kadira && Kadira.trackError) {
      Kadira.trackError('react', error.stack.toString());
    }
  };

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error });
    this.sendToKadira(error);
    SlackService.sendError(error, info);
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
  children: PropTypes.node.isRequired,
  helper: PropTypes.string.isRequired,
  pathname: PropTypes.string,
};

ErrorBoundary.defaultProps = {
  pathname: undefined,
};

export default withErrorCatcher(ErrorBoundary)