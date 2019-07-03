import { Meteor } from 'meteor/meteor';
import { withProps } from 'recompose';

import { taskInsert } from 'core/api';
import { LOANS_COLLECTION } from 'core/api/constants';
import LoanTaskInsertForm from './LoanTaskInsertForm';
import { schema } from '../../../../components/TasksTable/TaskModifier';

const LoanTaskInserter = withProps(({ loan: { _id: loanId, user } }) => ({
  onSubmit: values =>
    taskInsert.run({
      object: { docId: loanId, collection: LOANS_COLLECTION, ...values },
    }),
  schema: schema.omit('status'),
  model: {
    assigneeLink: {
      _id:
        (user && user.assignedEmployee && user.assignedEmployee._id)
        || Meteor.userId(),
    },
  },
  buttonLabelId: 'LoanTaskInsertForm.label',
  formTitleId: 'LoanTaskInsertForm.dialogTitle',
  formDescriptionId: 'LoanTaskInsertForm.dialogDescription',
}));

export default LoanTaskInserter(LoanTaskInsertForm);
