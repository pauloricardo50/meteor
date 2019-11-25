import ContactSchema from './schemas/contactSchema';
import { CONTACTS_COLLECTION } from './contactsConstants';
import { createCollection } from '../helpers/collectionHelpers';

const Contacts = createCollection(CONTACTS_COLLECTION);

Contacts.attachSchema(ContactSchema);
export default Contacts;
