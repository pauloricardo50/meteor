import SecurityService from '../../security';
import PartnerService from '../PartnerService';
import {
  partnerInsert,
  partnerRemove,
  partnerUpdate,
} from '../methodDefinitions';

partnerInsert.setHandler((context, { partner }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return PartnerService.insert(partner);
});

partnerRemove.setHandler((context, { partnerId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return PartnerService.remove(partnerId);
});

partnerUpdate.setHandler((context, { partnerId, object }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return PartnerService._update({ id: partnerId, object });
});
