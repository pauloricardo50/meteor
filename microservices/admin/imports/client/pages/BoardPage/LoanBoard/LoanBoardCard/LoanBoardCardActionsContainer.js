import { compose, withProps } from 'recompose';

import { ACTIVITY_TYPES } from 'core/api/activities/activityConstants';
import { activityInsert } from 'core/api/activities/methodDefinitions';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { taskInsert } from 'core/api/tasks/methodDefinitions';

import { getActivitySchema } from '../../../../components/AdminTimeline/AdminActivityAdder';
import { schema } from '../../../../components/TasksTable/TaskModifier';

const taskSchema = schema.omit('assigneeLink', 'status');

export default compose(
  withProps(({ loanId }) => ({
    insertTask: values =>
      taskInsert.run({
        object: { docId: loanId, collection: LOANS_COLLECTION, ...values },
      }),
    insertActivity: values =>
      activityInsert.run({
        object: { loanLink: { _id: loanId }, ...values },
      }),
    taskSchema,
    activitySchema: getActivitySchema(
      type =>
        ![ACTIVITY_TYPES.MEETING, ACTIVITY_TYPES.FINANCIAL_PLANNING].includes(
          type,
        ),
    ),
  })),
);
