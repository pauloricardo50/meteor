import { createCollection } from '../helpers/collectionHelpers';
import { CONTACTS_COLLECTION } from './contactsConstants';
import ContactSchema from './schemas/contactSchema';

const Contacts = createCollection(CONTACTS_COLLECTION, ContactSchema);

export default Contacts;
