import { compose, withProps } from 'recompose';

import { withSmartQuery } from '../../api/containerToolkit';
import { proOrganisation } from '../../api/organisations/queries';

export default compose(
  withSmartQuery({
    query: proOrganisation,
    queryOptions: { reactive: false, single: true, shouldRefetch: () => false },
    params: ({ organisationId }) => ({
      organisationId,
      $body: { generatedRevenues: 1, generatedProductions: 1 },
    }),
    dataName: 'orgWithRevenues',
  }),
  withProps(
    ({ orgWithRevenues: { generatedRevenues, generatedProductions } }) => ({
      generatedRevenues,
      generatedProductions,
    }),
  ),
);
