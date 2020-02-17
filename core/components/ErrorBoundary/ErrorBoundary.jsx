import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose, withProps } from 'recompose';
import LayoutError from './LayoutError';
import RootError from './RootError';
import withErrorCatcher from '../../containers/withErrorCatcher';
import { logError } from '../../api/slack/methodDefinitions';
import FrontError from './FrontError';

const sendToKadira = error => {
  // Error should also log to kadira
  const { Kadira } = window;
  if (Kadira && Kadira.trackError) {
    Kadira.trackError('react', error.stack.toString());
  }
};
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Remove error if user switches page
  // If it crashes again then it will simply go through componentDidCatch
  UNSAFE_componentWillReceiveProps({ pathname }) {
    if (this.state.hasError && pathname !== this.props.pathname) {
      this.setState({ hasError: false, error: null });
    }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error });
    this.props.onCatch(error, info);
  }

  componentDidUpdate() {
    const { containerError } = this.props;
    const { hasError } = this.state;
    if (containerError && !hasError) {
      this.setState({ hasError: true, error: containerError });
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
        case 'front':
          return <FrontError error={error} />;
        default:
          return <>Woops!</>;
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

export default compose(
  withErrorCatcher,
  withProps({
    onCatch: (error, info) => {
      sendToKadira(error);
      logError.run({
        error: JSON.parse(
          JSON.stringify(error, Object.getOwnPropertyNames(error)),
        ),
        additionalData: ['Render error', info],
        url:
          window && window.location && window.location.href
            ? window.location.href
            : '',
      });
    },
  }),
)(ErrorBoundary);
