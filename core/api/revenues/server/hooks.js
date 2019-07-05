import NotificationService from '../../notifications/server/NotificationService';
import Revenues from '..';
import { REVENUE_STATUS } from '../revenueConstants';

Revenues.before.update((userId, { _id: revenueId }, fieldNames, modifier) => {
  if (fieldNames.includes('status') || fieldNames.includes('paidAt')) {
    const newStatus = modifier.$set && modifier.$set.status;
    const newPaidAt = modifier.$set && modifier.$set.paidAt;

    if (newStatus === REVENUE_STATUS.CLOSED || newPaidAt) {
      NotificationService.readNotificationAll({
        filters: { 'revenueLink._id': revenueId },
      });
    }
  }
});

Revenues.before.update((userId, { _id: revenueId, expectedAt: oldDate }, fieldNames, modifier) => {
  if (fieldNames.includes('expectedAt')) {
    const newDate = modifier.$set && modifier.$set.expectedAt;

    if ((newDate && newDate.getTime()) !== (oldDate && oldDate.getTime())) {
      NotificationService.remove({ 'revenueLink._id': revenueId });
    }
  }
});
