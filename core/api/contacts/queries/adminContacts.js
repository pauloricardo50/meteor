import { contact } from '../../fragments';
import Contacts from '../contacts';
import { CONTACTS_QUERIES } from '../contactsConstants';

export default Contacts.createQuery(CONTACTS_QUERIES.ADMIN_CONTACTS, contact());
