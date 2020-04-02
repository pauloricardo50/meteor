import React from 'react';

import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';

const PropertyRelatedDoc = ({ loans = [], promotion, category }) => {
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
