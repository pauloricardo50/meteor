import { withProps } from 'recompose';
import { taskInsert } from 'core/api';
import LoanTaskInsertForm from './LoanTaskInsertForm';

const LoanTaskInserter = withProps(({
  loan: {
    _id: loanId,
    user: { assignedEmployee },
  },
  refetch,
}) => ({
  onSubmit: ({ title }) =>
    taskInsert
      .run({
        docId: loanId,
        title,
        assignedTo: assignedEmployee && assignedEmployee._id,
      })
      .then(refetch),
  buttonLabelId: 'LoanTaskInsertForm.label',
  form: 'loan-add-task',
  formTitleId: 'LoanTaskInsertForm.dialogTitle',
  formDescriptionId: 'LoanTaskInsertForm.dialogDescription',
}));

export default LoanTaskInserter(LoanTaskInsertForm);
