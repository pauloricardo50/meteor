import { compose, mapProps, withProps } from 'recompose';

import { PROPERTY_DOCUMENTS } from 'core/api/constants';
import { withSmartQuery } from '../../api';
import { userProperty } from '../../api/properties/queries';

const getPropertyDocuments = property => {
  const { documents = {} } = property;
  return Object.keys(documents)
    .filter(category => category !== PROPERTY_DOCUMENTS.PROPERTY_PICTURES)
    .reduce((docs, category) => [...docs, ...documents[category]], []);
};

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
  withProps(({ property }) => ({
    documents: getPropertyDocuments(property),
  })),
);
