//      
import React from 'react';
import { PROPERTY_CATEGORY } from 'imports/core/api/constants';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import { PROMOTIONS_COLLECTION, LOANS_COLLECTION } from 'core/api/constants';

                                  

const PropertyRelatedDoc = ({
  loans = [],
  promotion,
  category,
}                         ) => {
  if (category === PROPERTY_CATEGORY.PROMOTION) {
    return (
      <CollectionIconLink
        relatedDoc={{ ...promotion, collection: PROMOTIONS_COLLECTION }}
      />
    );
  }

  return loans.map(loan => (
    <CollectionIconLink
      key={loan._id}
      relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
    />
  ));
};

export default PropertyRelatedDoc;
