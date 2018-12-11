import { Mongo } from 'meteor/mongo';

import ContactSchema from './schemas/contactSchema';
import { CONTACTS_COLLECTION } from './contactsConstants';

const Contacts = new Mongo.Collection(CONTACTS_COLLECTION);

Contacts.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Contacts.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Contacts.attachSchema(ContactSchema);
export default Contacts;
