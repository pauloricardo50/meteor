import { compose, mapProps } from 'recompose';

import { withSmartQuery } from '../../api';
import userProperty from '../../api/properties/queries/userProperty';

export default compose(
  mapProps(({ property: { _id: propertyId } }) => ({ propertyId })),
  withSmartQuery({
    query: userProperty,
    params: ({ propertyId }) => ({ propertyId }),
    // Don't refetch this since it will get the opengraph data
    queryOptions: { reactive: false, single: true, shouldRefetch: () => false },
    dataName: 'property',
  }),
);
