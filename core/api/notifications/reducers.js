import Notifications from './notifications';
import { LOANS_COLLECTION } from '../loans/loanConstants';

Notifications.addReducers({
  relatedDoc: {
    body: { activity: { loan: { name: 1 } }, task: { loan: { name: 1 } } },
    reduce: ({ activity, task }) => {
      if (activity) {
        if (activity.loan) {
          return { ...activity.loan, collection: LOANS_COLLECTION };
        }
      }
      if (task) {
        if (task.loan) {
          return { ...task.loan, collection: LOANS_COLLECTION };
        }
      }
    },
  },
});
