import React from 'react';
import { compose } from 'recompose';

import { adminBorrowers as query } from 'core/api/borrowers/queries';
import { withSmartQuery } from 'core/api/containerToolkit';
import withTranslationContext from 'core/components/Translation/withTranslationContext';

export default compose(
  Component => props => (
    <Component {...props} key={props.match.params.borrowerId} />
  ),
  withSmartQuery({
    query,
    params: ({ match }) => ({ _id: match.params.borrowerId }),
    queryOptions: { reactive: false, single: true },
    dataName: 'borrower',
  }),
  withTranslationContext(({ borrower }) => ({ gender: borrower.gender })),
);
