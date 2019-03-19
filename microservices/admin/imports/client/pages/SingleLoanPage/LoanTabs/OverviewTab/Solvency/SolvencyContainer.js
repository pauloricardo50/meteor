import { compose, withProps, withState } from 'recompose';

import { withSmartQuery } from 'core/api';
import { ORGANISATION_FEATURES } from 'core/api/constants';
import adminOrganisations from 'core/api/organisations/queries/adminOrganisations';

export default compose(
  withSmartQuery({
    query: adminOrganisations,
    params: { features: ORGANISATION_FEATURES.LENDER },
    dataName: 'organisations',
    queryOptions: { reactive: false },
  }),
  withProps(({ organisations }) => ({
    organisations: organisations.filter(({ lenderRules }) => lenderRules && lenderRules.length > 0),
  })),
  withState('showAll', 'setShowAll', false),
);
