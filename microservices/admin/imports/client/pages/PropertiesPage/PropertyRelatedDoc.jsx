import React from 'react';

import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';

const PropertyRelatedDoc = ({ loans = [], promotion, category }) => {
  if (category === PROPERTY_CATEGORY.PROMOTION) {
    return <CollectionIconLink relatedDoc={promotion} />;
  }

  return loans.map(loan => (
    <CollectionIconLink key={loan._id} relatedDoc={loan} />
  ));
};

export default PropertyRelatedDoc;
