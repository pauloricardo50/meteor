import { compose, withProps, withState } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { lenderRules } from 'core/api/fragments';
import { ORGANISATION_FEATURES } from 'core/api/organisations/organisationConstants';
import { adminOrganisations } from 'core/api/organisations/queries';
import { RESIDENCE_TYPE } from 'core/api/properties/propertyConstants';

export default compose(
  withSmartQuery({
    query: adminOrganisations,
    params: {
      features: ORGANISATION_FEATURES.LENDER,
      $body: { name: 1, logo: 1, lenderRules: lenderRules() },
    },
    dataName: 'organisations',
    queryOptions: { reactive: false },
  }),
  withProps(({ organisations }) => ({
    organisations: organisations.filter(
      ({ lenderRules }) => lenderRules && lenderRules.length > 0,
    ),
  })),
  withState('showAll', 'setShowAll', false),
  withState('singleLender', 'setSingleLender', false),
  withState('residenceType', 'setResidenceType', RESIDENCE_TYPE.MAIN_RESIDENCE),
  withState('canton', 'setCanton', 'GE'),
);
