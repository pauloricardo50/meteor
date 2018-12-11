import { withSmartQuery } from 'core/api/containerToolkit/index';
import query from 'core/api/contacts/queries/contacts';

export default withSmartQuery({
  query,
  queryOptions: { reactive: true },
  dataName: 'contacts',
  smallLoader: true,
});
