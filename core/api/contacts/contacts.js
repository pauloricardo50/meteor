import { createCollection } from '../helpers/collectionHelpers';
import { CONTACTS_COLLECTION } from './contactsConstants';
import ContactSchema from './schemas/contactSchema';

const Contacts = createCollection(CONTACTS_COLLECTION);

Contacts.attachSchema(ContactSchema);
export default Contacts;
