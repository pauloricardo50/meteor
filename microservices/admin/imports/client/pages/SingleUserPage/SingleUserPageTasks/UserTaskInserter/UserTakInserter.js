import { Meteor } from 'meteor/meteor';
import { withProps } from 'recompose';

import { taskInsert } from 'core/api';
import { USERS_COLLECTION } from 'core/api/constants';
import UserTaskInsertForm from './UserTaskInsertForm';
import {
  schema,
  taskFormLayout,
} from '../../../../components/TasksTable/TaskModifier';

const UserTaskInserter = withProps(
  ({ user: { _id: userId, assignedEmployee } }) => ({
    onSubmit: values =>
      taskInsert.run({
        object: { docId: userId, collection: USERS_COLLECTION, ...values },
      }),
    schema: schema.omit('status'),
    model: {
      assigneeLink: {
        _id: (assignedEmployee && assignedEmployee._id) || Meteor.userId(),
      },
    },
    buttonLabelId: 'UserTaskInsertForm.label',
    formTitleId: 'UserTaskInsertForm.dialogTitle',
    formDescriptionId: 'UserTaskInsertForm.dialogDescription',
    layout: taskFormLayout,
  }),
);

export default UserTaskInserter(UserTaskInsertForm);
