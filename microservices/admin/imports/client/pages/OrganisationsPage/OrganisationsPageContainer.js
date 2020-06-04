import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { compose, withProps, withState } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { organisationInsert } from 'core/api/organisations/methodDefinitions';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { createRoute } from 'core/utils/routerUtils';

import ADMIN_ROUTES from '../../../startup/client/adminRoutes';

export default compose(
  withRouter,
  withState('filters', 'setFilters', ({ location }) =>
    queryString.parse(location.search, { arrayFormat: 'bracket' }),
  ),
  withProps(({ history }) => ({
    insertOrganisation: organisation =>
      organisationInsert.run({ organisation }).then(organisationId => {
        history.push(
          createRoute(ADMIN_ROUTES.SINGLE_ORGANISATION_PAGE.path, {
            organisationId,
          }),
        );
      }),
  })),
  withSmartQuery({
    query: ORGANISATIONS_COLLECTION,
    params: ({ filters }) => ({
      $filters: {
        ...(filters.tags?.length ? { tags: { $in: filters.tags } } : {}),
        ...(filters.type?.length ? { type: { $in: filters.type } } : {}),
      },
      name: 1,
      logo: 1,
      features: 1,
      type: 1,
      commissionRates: { type: 1, rates: 1 },
    }),
    deps: ({ filters }) => [filters.tags, filters.type],
    dataName: 'organisations',
  }),
);
