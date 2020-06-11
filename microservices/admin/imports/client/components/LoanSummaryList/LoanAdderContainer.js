import { withProps } from 'recompose';

import { adminLoanInsert } from 'core/api/loans/methodDefinitions';

export default withProps(({ userId, onSuccess = () => {} }) => ({
  onSubmit: ({ purchaseType }) =>
    adminLoanInsert.run({ userId, loan: { purchaseType } }).then(onSuccess),
}));
