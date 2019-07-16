import { compose, mapProps } from 'recompose';

import { withSmartQuery } from '../../api';
import { userProperty } from '../../api/properties/queries';

export default compose(
  mapProps(({ property: { _id: propertyId }, simple, loan }) => ({
    propertyId,
    simple,
    loan,
  })),
  withSmartQuery({
    query: userProperty,
    params: ({ propertyId }) => ({ _id: propertyId }),
    // Don't refetch this since it will get the opengraph data
    queryOptions: { reactive: false, single: true, shouldRefetch: () => false },
    dataName: 'property',
  }),
);
