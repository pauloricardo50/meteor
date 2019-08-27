import { compose, withProps, withState } from 'recompose';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import { organisationInsert } from 'core/api';
import { withSmartQuery } from 'core/api/containerToolkit/index';
import { adminOrganisations } from 'core/api/organisations/queries';
import { createRoute } from 'core/utils/routerUtils';
import ADMIN_ROUTES from '../../../startup/client/adminRoutes';

export default compose(
  withRouter,
  withState('filters', 'setFilters', ({ location }) =>
    queryString.parse(location.search, { arrayFormat: 'bracket' })),
  withProps(({ history }) => ({
    insertOrganisation: organisation =>
      organisationInsert.run({ organisation }).then((organisationId) => {
        history.push(createRoute(ADMIN_ROUTES.SINGLE_ORGANISATION_PAGE.path, {
          organisationId,
        }));
      }),
  })),
  withSmartQuery({
    query: adminOrganisations,
    params: ({ filters }) => ({
      ...filters,
      $body: { name: 1, logo: 1, features: 1, $filter: 1 },
    }),
    dataName: 'organisations',
  }),
);
