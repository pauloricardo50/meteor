import query from 'core/api/properties/queries/adminProperty';
import { withSmartQuery } from 'core/api';

export default withSmartQuery({
  query: ({ match, propertyId }) =>
    query.clone({ propertyId: propertyId || match.params.propertyId }),
  queryOptions: { reactive: true, single: true },
  dataName: 'property',
});
