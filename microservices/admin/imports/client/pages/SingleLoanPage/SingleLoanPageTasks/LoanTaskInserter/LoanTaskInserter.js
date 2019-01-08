import { withProps, compose } from 'recompose';

import { taskInsert, withSmartQuery } from 'core/api';
import query from 'core/api/users/queries/admins';
import LoanTaskInsertForm from './LoanTaskInsertForm';

const LoanTaskInserter = compose(
  withSmartQuery({ query, dataName: 'admins', smallLoader: true }),
  withProps(({ loan: { _id: loanId, user } }) => ({
    onSubmit: values => taskInsert.run({ docId: loanId, ...values }),
    model: {
      assignedEmployeeId:
        user && user.assignedEmployee && user.assignedEmployee._id,
    },
    buttonLabelId: 'LoanTaskInsertForm.label',
    formTitleId: 'LoanTaskInsertForm.dialogTitle',
    formDescriptionId: 'LoanTaskInsertForm.dialogDescription',
  })),
);

export default LoanTaskInserter(LoanTaskInsertForm);
