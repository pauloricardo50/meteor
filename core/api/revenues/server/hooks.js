import NotificationService from '../../notifications/server/NotificationService';
import { REVENUE_STATUS } from '../revenueConstants';
import Revenues from '..';

Revenues.before.update(
  (userId, { _id: revenueId, expectedAt: oldDate }, fieldNames, modifier) => {
    // Read the notification automatically if a paidAt date is added, or if
    // the status is set to CLOSED
    if (fieldNames.includes('status') || fieldNames.includes('paidAt')) {
      const newStatus = modifier.$set && modifier.$set.status;
      const newPaidAt = modifier.$set && modifier.$set.paidAt;

      if (newStatus === REVENUE_STATUS.CLOSED || newPaidAt) {
        NotificationService.readNotificationAll({
          filters: { 'revenueLink._id': revenueId },
        });
      }
    }

    // Cancel notification if expetedAt changes
    if (fieldNames.includes('expectedAt')) {
      const newDate = modifier.$set && modifier.$set.expectedAt;

      if ((newDate && newDate.getTime()) !== (oldDate && oldDate.getTime())) {
        NotificationService.remove({ 'revenueLink._id': revenueId });
      }
    }
  },
);
