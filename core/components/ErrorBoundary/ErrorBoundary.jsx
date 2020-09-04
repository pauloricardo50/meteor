import { Meteor } from 'meteor/meteor';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, withProps } from 'recompose';

import { logError } from '../../api/errorLogger/methodDefinitions';
import withErrorCatcher from '../../containers/withErrorCatcher';
import FrontError from './FrontError';
import LayoutError from './LayoutError';
import RootError from './RootError';

const sendToMonti = error => {
  // Error should also log to kadira
  const { Monti } = window;
  if (Monti && Monti.trackError) {
    Monti.trackError('react', error?.message, {
      stacks: error?.stack,
    });
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
      this.resetError();
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

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

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

    return React.Children.map(children, child =>
      React.cloneElement(child, { resetError: this.resetError }),
    );
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
      console.error(error);
      sendToMonti(error);

      if (Meteor.isTest) {
        return;
      }

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
