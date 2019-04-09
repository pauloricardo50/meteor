import React from 'react';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import T from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';
import { PROPERTIES_COLLECTION } from 'core/api/constants';

const getImage = ({ documents = {}, imageUrls = [] }) => {
  let images = [];
  if (imageUrls.length) {
    images = imageUrls;
  }

  if (documents.propertyImages && documents.propertyImages.length) {
    images = [...images, documents.propertyImages.map(({ url }) => url)];
  }

  if (documents.promotionImage && documents.promotionImage.length) {
    images = [...images, documents.promotionImage.map(({ url }) => url)];
  }

  if (images.length === 0) {
    return null;
  }

  return images[0];
};

export default compose(
  withRouter,
  mapProps(({ history, document, collection, loanId, additionalInfos }) => ({
    name: <span>{document.name || document.address1}</span>,
    address: document.address,
    category: document.category,
    buttonLabel: (
      <T
        id={`SimpleDashboardPage.propertyCardButton.${
          collection === PROPERTIES_COLLECTION ? 'property' : 'promotion'
        }`}
      />
    ),
    onClick: () =>
      history.push(createRoute('/loans/:loanId/:collection/:docId', {
        loanId,
        collection,
        docId: document._id,
      })),
    image: getImage(document),
    additionalInfos,
  })),
);
