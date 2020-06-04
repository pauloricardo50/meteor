import { compose, mapProps, withState } from 'recompose';

import { withSmartQuery } from '../../../../api/containerToolkit';
import { lenderRules } from '../../../../api/fragments';
import {
  ORGANISATIONS_COLLECTION,
  ORGANISATION_FEATURES,
} from '../../../../api/organisations/organisationConstants';

export default compose(
  withSmartQuery({
    query: ORGANISATIONS_COLLECTION,
    params: {
      $filters: {
        features: ORGANISATION_FEATURES.LENDER,
        lenderRulesCount: { $gte: 1 },
      },
      lenderRules: lenderRules(),
      name: 1,
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
