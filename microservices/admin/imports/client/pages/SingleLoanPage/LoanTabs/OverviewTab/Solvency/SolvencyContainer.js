import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api';
import adminOrganisations from 'core/api/organisations/queries/adminOrganisations';

export default compose(
  withSmartQuery({
    query: adminOrganisations,
    dataName: 'organisations',
    queryOptions: { reactive: false },
  }),
  withProps(({ organisations }) => ({
    organisations: organisations.filter(({ lenderRules }) => lenderRules && lenderRules.length > 0),
  })),
);
