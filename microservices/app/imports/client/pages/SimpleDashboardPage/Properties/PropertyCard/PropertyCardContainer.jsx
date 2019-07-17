import React from 'react';
import { compose, withProps, withState } from 'recompose';
import { withRouter } from 'react-router-dom';

import T from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';
import { PROPERTIES_COLLECTION, PROPERTY_DOCUMENTS } from 'core/api/constants';

const getImage = ({ documents = {}, imageUrls = [] }) => {
  let images = [];
  if (imageUrls.length) {
    images = imageUrls;
  }

  if (
    documents[PROPERTY_DOCUMENTS.PROPERTY_PICTURES]
    && documents[PROPERTY_DOCUMENTS.PROPERTY_PICTURES].length
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

export default compose(
  withRouter,
  withState('showResidenceTypeSetter', 'setShowResidenceTypeSetter', false),
  withProps(({
    additionalInfos,
    collection,
    document,
    history,
    loan: { _id: loanId, residenceType },
    shareSolvency,
    setShowResidenceTypeSetter,
  }) => ({
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
    onClick: () => {
      if (!residenceType) {
        setShowResidenceTypeSetter(true);
      } else {
        history.push(createRoute('/loans/:loanId/:collection/:docId', {
          loanId,
          collection,
          docId: document._id,
        }));
      }
    },
    image: getImage(document),
    additionalInfos,
    loanId,
    shareSolvency,
    route: createRoute('/loans/:loanId/:collection/:docId', {
      loanId,
      collection,
      docId: document._id,
    }),
  })),
);
