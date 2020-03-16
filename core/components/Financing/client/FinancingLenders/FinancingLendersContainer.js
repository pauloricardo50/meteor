import { compose, mapProps, withState } from 'recompose';

import { lenderRules } from 'core/api/fragments';
import { withSmartQuery } from '../../../../api/containerToolkit';
import { ORGANISATION_FEATURES } from '../../../../api/constants';
import { adminOrganisations } from '../../../../api/organisations/queries';

export default compose(
  withSmartQuery({
    query: adminOrganisations,
    params: {
      features: ORGANISATION_FEATURES.LENDER,
      $body: {
        lenderRules: lenderRules(),
        name: 1,
      },
    },
    queryOptions: {
      reactive: false,
      single: false,
      shouldRefetch: () => false,
    },
    dataName: 'organisations',
    refetchOnMethodCall: false,
  }),
  withState(
    'showAllLenders',
    'setShowAllLenders',
    ({ loan: { lenders = [] } }) => lenders.length === 0,
  ),
  mapProps(
    ({
      organisations,
      loan: { lenders = [] },
      showAllLenders,
      setShowAllLenders,
    }) => ({
      organisations: showAllLenders
        ? organisations
        : organisations.filter(({ _id }) =>
            lenders.find(
              ({ organisation: { _id: organisationId } }) =>
                _id === organisationId,
            ),
          ),
      showAllLenders,
      setShowAllLenders,
    }),
  ),
);
