import { compose, withProps, withState } from 'recompose';

import { taskInsert } from 'core/api/methods';
import { LOANS_COLLECTION } from 'core/api/constants';
import { schema } from '../../../../components/TasksTable/TaskModifier';

const taskSchema = schema.omit('assigneeLink', 'status');
const reminderSchema = schema.pick('title').extend({
  dueAtTime: {
    type: String,
    optional: true,
    uniforms: {
      type: 'time',
    },
  },
});

export default compose(
  withState('openReminder', 'setOpenReminder', false),
  withState('openTask', 'setOpenTask', false),
  withProps(({ openReminder, loanId, setOpenReminder, setOpenTask }) => ({
    insertReminder: values =>
      taskInsert
        .run({
          object: { docId: loanId, collection: LOANS_COLLECTION, ...values },
        })
        .then(() => setOpenReminder(false)),
    insertTask: values =>
      taskInsert
        .run({
          object: { docId: loanId, collection: LOANS_COLLECTION, ...values },
        })
        .then(() => setOpenTask(false)),
    schema: openReminder ? reminderSchema : taskSchema,
  })),
);
