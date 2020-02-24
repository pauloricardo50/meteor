import { withProps } from 'recompose';
import { adminLoanInsert } from 'core/api';

export default withProps(({ userId, onSuccess = () => {} }) => ({
  onSubmit: values => adminLoanInsert.run({ userId }).then(onSuccess),
}));
