import query from 'core/api/properties/queries/adminProperty';
import { withSmartQuery } from 'core/api';

export default withSmartQuery({
  query,
  params: ({ match, propertyId }) => ({
    propertyId: propertyId || match.params.propertyId,
  }),
  queryOptions: { reactive: true, single: true },
  dataName: 'property',
});
