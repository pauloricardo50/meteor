import React from 'react';
import { withProps } from 'recompose';

import { PROPERTY_DOCUMENTS } from 'core/api/files/fileConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { createRoute } from 'core/utils/routerUtils';

const getImage = ({ documents = {}, imageUrls = [] }) => {
  let images = [];
  if (imageUrls.length) {
    images = imageUrls;
  }

  if (
    documents[PROPERTY_DOCUMENTS.PROPERTY_PICTURES] &&
    documents[PROPERTY_DOCUMENTS.PROPERTY_PICTURES].length
  ) {
    images = [
      ...images,
      ...documents[PROPERTY_DOCUMENTS.PROPERTY_PICTURES].map(({ url }) => url),
    ];
  }

  if (documents.promotionImage && documents.promotionImage.length) {
    images = [...images, ...documents.promotionImage.map(({ url }) => url)];
  }

  if (images.length === 0) {
    return null;
  }

  return images[0];
};

export default withProps(
  ({
    additionalInfos,
    collection,
    document,
    loan: { _id: loanId },
    shareSolvency,
  }) => ({
    name: <span>{document.name || document.address1}</span>,
    address: document.address,
    category: document.category,
    image: getImage(document),
    additionalInfos,
    loanId,
    shareSolvency,
    route: createRoute('/loans/:loanId/:collection/:docId/:tabId', {
      loanId,
      collection,
      docId: document._id,
      tabId: collection === PROMOTIONS_COLLECTION ? 'overview' : '',
    }),
  }),
);
