import { withSmartQuery } from 'core/api/containerToolkit';
import query from 'core/api/contacts/queries/contacts';

export default withSmartQuery({
  query,
  queryOptions: { reactive: false },
  dataName: 'contacts',
  smallLoader: true,
});
