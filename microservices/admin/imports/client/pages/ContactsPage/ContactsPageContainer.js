import { withSmartQuery } from 'core/api/containerToolkit';
import query from 'core/api/contacts/queries/adminContacts';

export default withSmartQuery({ query, dataName: 'contacts' });
