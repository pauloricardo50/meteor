import { withProps } from 'recompose';
import { loanTaskInsert } from 'core/api';
import LoanTaskInsertForm from './LoanTaskInsertForm';

const LoanTaskInserter = withProps(({ loanId }) => ({
  onSubmit: ({ title }) => loanTaskInsert.run({ loanId, title }),
  buttonLabelId: 'LoanTaskInsertForm.label',
  form: 'loan-add-task',
  formTitleId: 'LoanTaskInsertForm.dialogTitle',
  formDescriptionId: 'LoanTaskInsertForm.dialogDescription',
}));

export default LoanTaskInserter(LoanTaskInsertForm);
