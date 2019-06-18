import { compose, withProps, withState } from 'recompose';

import { taskInsert } from 'core/api/methods';
import { LOANS_COLLECTION } from 'core/api/constants';
import { schema } from '../../../components/TasksTable/TaskModifier';

const taskSchema = schema.omit('assigneeLink', 'status');

export default compose(
  withState('openTask', 'setOpenTask', false),
  withProps(({ loanId, setOpenTask }) => ({
    insertTask: values =>
      taskInsert
        .run({
          object: { docId: loanId, collection: LOANS_COLLECTION, ...values },
        })
        .then(() => setOpenTask(false)),
    schema: taskSchema,
  })),
);
