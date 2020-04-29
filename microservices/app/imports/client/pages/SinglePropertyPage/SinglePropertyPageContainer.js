import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import withMatchParam from 'core/containers/withMatchParam';

import withSimpleAppPage from '../../components/SimpleAppPage/SimpleAppPage';

export default compose(
  withMatchParam('propertyId'),
  withRouter,
  withSimpleAppPage,
);
