import { compose, withProps, withState } from 'recompose';

import { taskInsert } from 'core/api/methods';
import { LOANS_COLLECTION, ACTIVITY_TYPES } from 'core/api/constants';
import { activityInsert } from 'core/api/activities/methodDefinitions';
import { schema } from '../../../../components/TasksTable/TaskModifier';
import { getActivitySchema } from '../../../../components/AdminTimeline/AdminActivityAdder';

const taskSchema = schema.omit('assigneeLink', 'status');

export default compose(
  withState('openTask', 'setOpenTask', false),
  withState('openActivity', 'setOpenActivity', false),
  withProps(({ loanId, setOpenTask, setOpenActivity }) => ({
    insertTask: values =>
      taskInsert
        .run({
          object: { docId: loanId, collection: LOANS_COLLECTION, ...values },
        })
        .then(() => setOpenTask(false)),
    insertActivity: values =>
      activityInsert
        .run({
          object: { loanLink: { _id: loanId }, ...values },
        })
        .then(() => setOpenActivity(false)),
    taskSchema,
    activitySchema: getActivitySchema(
      type =>
        ![ACTIVITY_TYPES.MEETING, ACTIVITY_TYPES.FINANCIAL_PLANNING].includes(
          type,
        ),
    ),
  })),
);
