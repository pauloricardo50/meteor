import { withSmartQuery } from 'core/api/containerToolkit';
import { adminContacts as query } from 'core/api/contacts/queries';

export default withSmartQuery({ query, dataName: 'contacts' });
