import { adminContacts as query } from 'core/api/contacts/queries';
import { withSmartQuery } from 'core/api/containerToolkit';

export default withSmartQuery({ query, dataName: 'contacts' });
