import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import { createRoute } from 'core/utils/routerUtils';
import ADMIN_ROUTES from '../../../startup/client/adminRoutes';

export default compose(
  withRouter,
  withProps(({ organisation: { _id: organisationId }, history }) => ({
    onClick: () =>
      history.push(createRoute(ADMIN_ROUTES.SINGLE_ORGANISATION_PAGE.path, {
        organisationId,
        tabId: '',
      })),
  })),
);
