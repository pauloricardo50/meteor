import { withRouter } from 'react-router-dom';
import { compose, mapProps } from 'recompose';

import ErrorBoundary from './ErrorBoundary';

export default compose(
  withRouter,
  mapProps(({ history: { location: { pathname } }, ...props }) => ({
    pathname,
    helper: 'layout',
    ...props,
  })),
)(ErrorBoundary);
