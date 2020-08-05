import SecurityService from '../../security';
import {
  contactChangeOrganisations,
  contactInsert,
  contactRemove,
  contactUpdate,
} from '../methodDefinitions';
import ContactService from './ContactService';

contactInsert.setHandler((context, { contact }) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return ContactService.insert(contact);
});

contactRemove.setHandler((context, { contactId }) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return ContactService.remove(contactId);
});

contactUpdate.setHandler((context, { contactId, object }) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return ContactService._update({ id: contactId, object });
});

contactChangeOrganisations.setHandler(
  (context, { contactId, newOrganisations }) => {
    SecurityService.checkUserIsAdmin(context.userId);
    return ContactService.changeOrganisations({ contactId, newOrganisations });
  },
);
