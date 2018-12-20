import SecurityService from '../../security';
import LenderService from '../LenderService';
import {
  lenderInsert,
  lenderRemove,
  lenderUpdate,
  lenderLinkOrganisationAndContact,
} from '../methodDefinitions';

lenderInsert.setHandler((context, { lender }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LenderService.insert(lender);
});

lenderRemove.setHandler((context, { lenderId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LenderService.remove(lenderId);
});

lenderUpdate.setHandler((context, { lenderId, object }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LenderService._update({ id: lenderId, object });
});

lenderLinkOrganisationAndContact.setHandler(
  (context, { lenderId, organisationId, contactId }) => {
    SecurityService.checkCurrentUserIsAdmin();
    LenderService.addLink({
      id: lenderId,
      linkName: 'organisation',
      linkId: organisationId,
    });
    if (contactId) {
      LenderService.addLink({
        id: lenderId,
        linkName: 'contact',
        linkId: contactId,
      });
    }
  },
);
