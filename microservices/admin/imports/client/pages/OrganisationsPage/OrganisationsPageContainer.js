import { compose, withProps } from 'recompose';

import { organisationInsert } from 'core/api';
import { withSmartQuery } from 'core/api/containerToolkit/index';
import adminOrganisations from 'core/api/organisations/queries/adminOrganisations';

export default compose(
  withProps({
    insertOrganisation: organisation =>
      organisationInsert.run({ organisation }),
  }),
  withSmartQuery({
    query: adminOrganisations,
    dataName: 'organisations',
  }),
);
