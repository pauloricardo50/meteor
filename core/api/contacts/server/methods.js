import SecurityService from '../../security';
import {
  contactInsert,
  contactRemove,
  contactUpdate,
  contactChangeOrganisations,
} from '../methodDefinitions';
import ContactService from './ContactService';

contactInsert.setHandler((context, { contact }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return ContactService.insert(contact);
});

contactRemove.setHandler((context, { contactId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return ContactService.remove(contactId);
});

contactUpdate.setHandler((context, { contactId, object }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return ContactService._update({ id: contactId, object });
});

contactChangeOrganisations.setHandler(
  (context, { contactId, newOrganisations }) => {
    SecurityService.checkCurrentUserIsAdmin();
    return ContactService.changeOrganisations({ contactId, newOrganisations });
  },
);
