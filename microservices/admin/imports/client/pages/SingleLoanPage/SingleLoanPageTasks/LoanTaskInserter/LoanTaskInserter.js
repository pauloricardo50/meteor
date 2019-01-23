import { Meteor } from 'meteor/meteor';
import { withProps } from 'recompose';

import { taskInsert } from 'core/api';
import LoanTaskInsertForm from './LoanTaskInsertForm';
import { schema } from '../../../../components/TasksTable/TaskModifier';

const LoanTaskInserter = withProps(({ loan: { _id: loanId, user } }) => ({
  onSubmit: values => taskInsert.run({ docId: loanId, ...values }),
  schema,
  model: {
    assignedEmployeeId:
      (user && user.assignedEmployee && user.assignedEmployee._id)
      || Meteor.userId(),
  },
  buttonLabelId: 'LoanTaskInsertForm.label',
  formTitleId: 'LoanTaskInsertForm.dialogTitle',
  formDescriptionId: 'LoanTaskInsertForm.dialogDescription',
}));

export default LoanTaskInserter(LoanTaskInsertForm);
