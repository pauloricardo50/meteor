import SecurityService from '../../security';
import {
  lenderInsert,
  lenderLinkOrganisationAndContact,
  lenderRemove,
  lenderUpdate,
} from '../methodDefinitions';
import LenderService from './LenderService';

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
