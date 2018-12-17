import { compose } from 'recompose';

import query from 'core/api/borrowers/queries/adminBorrower';
import { withSmartQuery } from 'core/api';
import withTranslationContext from 'core/components/Translation/withTranslationContext';

export default compose(
  withSmartQuery({
    query,
    params: ({ match }) => ({ _id: match.params.borrowerId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'borrower',
  }),
  withTranslationContext(({ borrower }) => ({ gender: borrower.gender })),
);
