import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import { organisationInsert } from 'core/api';
import { withSmartQuery } from 'core/api/containerToolkit/index';
import adminOrganisations from 'core/api/organisations/queries/adminOrganisations';
import { SINGLE_ORGANISATION_PAGE } from 'imports/startup/client/adminRoutes';
import { createRoute } from 'imports/core/utils/routerUtils';

export default compose(
  withRouter,
  withProps(({ history }) => ({
    insertOrganisation: organisation =>
      organisationInsert.run({ organisation }).then((organisationId) => {
        history.push(createRoute(SINGLE_ORGANISATION_PAGE, { organisationId }));
      }),
  })),
  withSmartQuery({
    query: adminOrganisations,
    dataName: 'organisations',
  }),
);
