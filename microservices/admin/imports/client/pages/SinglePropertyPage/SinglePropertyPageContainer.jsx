import { withSmartQuery } from 'core/api/containerToolkit';
import { adminProperties } from 'core/api/properties/queries';

export default withSmartQuery({
  query: adminProperties,
  params: ({ match, propertyId }) => ({
    _id: propertyId || match.params.propertyId,
  }),
  queryOptions: { reactive: false, single: true },
  dataName: 'property',
});
