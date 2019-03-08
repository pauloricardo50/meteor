import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import { createRoute } from 'core/utils/routerUtils';
import { SINGLE_ORGANISATION_PAGE } from 'imports/startup/client/adminRoutes';

export default compose(
  withRouter,
  withProps(({ organisation: { _id: organisationId }, history }) => ({
    onClick: () =>
      history.push(createRoute(SINGLE_ORGANISATION_PAGE, { organisationId, tabId: '' })),
  })),
);
