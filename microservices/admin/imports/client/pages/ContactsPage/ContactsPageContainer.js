import { CONTACTS_COLLECTION } from 'core/api/contacts/contactsConstants';
import { withSmartQuery } from 'core/api/containerToolkit';
import { contact } from 'core/api/fragments';

export default withSmartQuery({
  query: CONTACTS_COLLECTION,
  params: contact(),
});
