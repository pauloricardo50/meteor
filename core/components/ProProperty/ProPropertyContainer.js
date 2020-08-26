import React from 'react';
import { compose, mapProps, withProps } from 'recompose';

import { withSmartQuery } from '../../api/containerToolkit';
import { PROPERTY_DOCUMENTS } from '../../api/files/fileConstants';
import { anonymousProperty, userProperty } from '../../api/properties/queries';
import useCurrentUser from '../../hooks/useCurrentUser';

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
  Component => props => <Component {...props} key={props.propertyId} />,
  withSmartQuery({
    query: () => {
      const currentUser = useCurrentUser();
      if (currentUser) {
        return userProperty;
      }
      return anonymousProperty;
    },
    params: ({ propertyId }) => ({
      _id: propertyId,
      $body: {
        address: 1,
        address1: 1,
        balconyArea: 1,
        city: 1,
        constructionYear: 1,
        description: 1,
        documents: 1,
        externalUrl: 1,
        flatType: 1,
        gardenArea: 1,
        houseType: 1,
        imageUrls: 1,
        insideArea: 1,
        landArea: 1,
        openGraphData: 1,
        propertyType: 1,
        roomCount: 1,
        status: 1,
        terraceArea: 1,
        totalValue: 1,
        useOpenGraph: 1,
        zipCode: 1,
      },
    }),
    // Don't refetch this since it will get the opengraph data
    queryOptions: { single: true },
    dataName: 'property',
  }),
  withProps(({ property }) => ({
    documents: getPropertyDocuments(property),
  })),
);
