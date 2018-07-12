import { withProps } from 'recompose';
import { adminLoanInsert } from 'core/api';

export default withProps(({ userId }) => ({
  onSubmit: values => adminLoanInsert.run({ userId }),
}));
