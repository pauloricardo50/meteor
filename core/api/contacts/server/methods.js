import SecurityService from '../../security';
import ContactService from '../ContactService';
import {
  contactInsert,
  contactRemove,
  contactUpdate,
} from '../methodDefinitions';

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
