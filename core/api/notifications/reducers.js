import Notifications from './notifications';
import { LOANS_COLLECTION } from '../loans/loanConstants';

Notifications.addReducers({
  relatedDoc: {
    body: {
      activity: { loan: { name: 1 } },
      task: { loan: { name: 1 } },
      revenue: { loan: { name: 1 } },
    },
    reduce: ({ activity, task, revenue }) => {
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
      if (revenue) {
        if (revenue.loan) {
          return { ...revenue.loan, collection: LOANS_COLLECTION };
        }
      }
    },
  },
  title: {
    body: {
      task: { title: 1, dueAt: 1 },
      activity: { title: 1, date: 1 },
      revenue: { type: 1, description: 1 },
    },
    reduce: ({ task, activity, revenue }) => {
      let title;
      if (task) {
        title = task.title;
      } else if (activity) {
        title = activity.title;
      } else if (revenue) {
        title = `Paiement "${revenue.type}" attendu`;
      } else {
        title = "L'orgine de la notification a été supprimée";
      }

      return title;
    },
  },
});
