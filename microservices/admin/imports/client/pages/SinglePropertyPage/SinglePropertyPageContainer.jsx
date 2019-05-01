import adminProperties from 'core/api/properties/queries/adminProperties';
import { withSmartQuery } from 'core/api';

export default withSmartQuery({
  query: adminProperties,
  params: ({ match, propertyId }) => ({
    _id: propertyId || match.params.propertyId,
  }),
  queryOptions: { reactive: true, single: true },
  dataName: 'property',
});
