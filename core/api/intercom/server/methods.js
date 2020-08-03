import { getClientTrackingId } from '../../../utils/server/getClientTrackingId';
import SecurityService from '../../security';
import {
  getIntercomContact,
  getIntercomSettings,
  updateIntercomVisitorTrackingId,
} from '../methodDefinitions';
import IntercomService from './IntercomService';

getIntercomSettings.setHandler(context => {
  context.unblock();
  return IntercomService.getIntercomSettings({ userId: context.userId });
});

getIntercomContact.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return IntercomService.getContact(params);
});

updateIntercomVisitorTrackingId.setHandler((context, params) => {
  context.unblock();
  return IntercomService.updateVisitorTrackingId({
    context,
    trackingId: getClientTrackingId(),
    ...params,
  });
});
