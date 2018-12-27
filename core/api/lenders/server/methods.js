import SecurityService from '../../security';
import LenderService from '../LenderService';
import {
  lenderInsert,
  lenderRemove,
  lenderUpdate,
  lenderLinkOrganisationAndContact,
} from '../methodDefinitions';

lenderInsert.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LenderService.insert(params);
});

lenderRemove.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LenderService.remove(params);
});

lenderUpdate.setHandler((context, { lenderId, object }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LenderService._update({ id: lenderId, object });
});

lenderLinkOrganisationAndContact.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LenderService.linkOrganisationAndContact(params);
});
