import { compose, withProps } from 'recompose';

import { withSmartQuery } from '../../api';
import { proOrganisation } from '../../api/organisations/queries';

export default compose(
  withSmartQuery({
    query: proOrganisation,
    queryOptions: { reactive: false, single: true, shouldRefetch: () => false },
    params: ({ organisationId }) => ({
      organisationId,
      $body: { generatedRevenues: 1 },
    }),
    dataName: 'orgWithRevenues',
  }),
  withProps(({ orgWithRevenues: { generatedRevenues } }) => ({
    generatedRevenues,
  })),
);
