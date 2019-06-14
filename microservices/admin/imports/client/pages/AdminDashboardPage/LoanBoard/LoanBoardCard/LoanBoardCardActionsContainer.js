import { compose, withProps, withState } from 'recompose';
import moment from 'moment';

import { taskInsert } from 'core/api/methods';
import { LOANS_COLLECTION } from 'core/api/constants';
import TaskModifierDateSetter from 'imports/client/components/TasksTable/TaskModifierDateSetter';
import { schema } from '../../../../components/TasksTable/TaskModifier';

const taskSchema = schema.omit('assigneeLink', 'status');
const reminderSchema = schema.pick('title').extend({
  dueAtHelpers: {
    type: String,
    optional: true,
    uniforms: {
      render: TaskModifierDateSetter,
      funcs: [
        {
          label: 'dans 1h',
          func: () => [
            'dueAtTime',
            moment()
              .add(1, 'h')
              .minute(0)
              .format('HH:mm'),
          ],
        },
        {
          label: 'dans 3h',
          func: () => [
            'dueAtTime',
            moment()
              .add(3, 'h')
              .minute(0)
              .format('HH:mm'),
          ],
        },
        {
          label: 'À 8h',
          func: () => [
            'dueAtTime',
            moment()
              .hours(8)
              .minute(0)
              .format('HH:mm'),
          ],
        },
      ],
    },
  },
  dueAtTime: {
    type: String,
    optional: true,
    uniforms: { type: 'time' },
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
