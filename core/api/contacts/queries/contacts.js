import Contacts from '../contacts';
import { contactFragment } from './contactsFragments';
import { CONTACTS_QUERIES } from '../contactsConstants';

export default Contacts.createQuery(CONTACTS_QUERIES.CONTACTS, {
  ...contactFragment,
});
