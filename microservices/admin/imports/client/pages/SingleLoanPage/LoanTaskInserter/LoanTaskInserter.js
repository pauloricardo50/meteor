import { withProps } from 'recompose';
import { taskInsert } from 'core/api';
import LoanTaskInsertForm from './LoanTaskInsertForm';

const LoanTaskInserter = withProps(({ loanId, refetch }) => ({
  onSubmit: ({ title }) =>
    taskInsert.run({ docId: loanId, title }).then(refetch),
  buttonLabelId: 'LoanTaskInsertForm.label',
  form: 'loan-add-task',
  formTitleId: 'LoanTaskInsertForm.dialogTitle',
  formDescriptionId: 'LoanTaskInsertForm.dialogDescription',
}));

export default LoanTaskInserter(LoanTaskInsertForm);
