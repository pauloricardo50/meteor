import Activities from '../activities';
import NotificationService from '../../notifications/server/NotificationService';

Activities.after.update(
  function (userId, doc, fieldNames) {
    if (fieldNames.includes('date')) {
      const { date: newDate } = doc;
      const { date: oldDate } = this.previous;

      if ((newDate && newDate.getTime()) !== (oldDate && oldDate.getTime())) {
        NotificationService.remove({ 'activityLink._id': doc._id });
      }
    }
  },
  { fetchPrevious: true },
);
