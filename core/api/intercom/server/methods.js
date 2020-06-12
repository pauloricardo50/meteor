import SecurityService from '../../security';
import { getIntercomContact, getIntercomSettings } from '../methodDefinitions';
import IntercomService from './IntercomService';

getIntercomSettings.setHandler(({ userId }) =>
  IntercomService.getIntercomSettings({ userId }),
);

getIntercomContact.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return IntercomService.getContact(params);
});
