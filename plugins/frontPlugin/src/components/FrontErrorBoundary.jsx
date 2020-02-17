import { compose, withProps, withState } from 'recompose';
import EpotekFrontApi from '../EpotekFrontApi';
import withErrorCatcher from '../core/containers/withErrorCatcher';
import { ErrorBoundary } from '../core/components/ErrorBoundary/ErrorBoundary';

export default compose(
  withState('containerError', 'setContainerError', null),
  withProps(({ setContainerError }) => ({
    helper: 'front',
    handleError: (error, additionalData) => {
      EpotekFrontApi.callMethod('logError', {
        error: JSON.parse(
          JSON.stringify(error, Object.getOwnPropertyNames(error)),
        ),
        additionalData: ['Front Plugin', ...additionalData],
      }).catch(e => {
        setContainerError(e);
      });
    },
    onCatch: (error, info) => {
      EpotekFrontApi.callMethod('logError', {
        error: JSON.parse(
          JSON.stringify(error, Object.getOwnPropertyNames(error)),
        ),
        additionalData: ['Front Plugin Render error', info],
      }).catch(e => {
        setContainerError(e);
      });
    },
  })),
  withErrorCatcher,
)(ErrorBoundary);
