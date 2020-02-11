import { Meteor } from 'meteor/meteor';
import { withProps } from 'recompose';

import { taskInsert } from 'core/api';
import { USERS_COLLECTION } from 'core/api/constants';
import UserTaskInsertForm from './UserTaskInsertForm';
import {
  schema,
  taskFormLayout,
} from '../../../../components/TasksTable/TaskModifier';

const UserTaskInserter = withProps(({ loan: { _id: loanId, user } }) => ({
  onSubmit: values =>
    taskInsert.run({
      object: { docId: loanId, collection: USERS_COLLECTION, ...values },
    }),
  schema: schema.omit('status'),
  model: {
    assigneeLink: {
      _id:
        (user && user.assignedEmployee && user.assignedEmployee._id) ||
        Meteor.userId(),
    },
  },
  buttonLabelId: 'UserTaskInsertForm.label',
  formTitleId: 'UserTaskInsertForm.dialogTitle',
  formDescriptionId: 'UserTaskInsertForm.dialogDescription',
  layout: taskFormLayout,
}));

export default UserTaskInserter(UserTaskInsertForm);
