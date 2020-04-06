import { withProps } from 'recompose';

import { adminLoanInsert } from 'core/api/loans/methodDefinitions';

export default withProps(({ userId, onSuccess = () => {} }) => ({
  onSubmit: values => adminLoanInsert.run({ userId }).then(onSuccess),
}));
