import React from 'react';

import DialogSimple from '../DialogSimple';
import UploaderArray from '../UploaderArray';

const offerDocumentsArray = [{ id: 'OTHER', noTooltips: true }];

const OfferDocuments = ({ offer }) => {
  const documentsCount = Object.keys(offer.documents || {}).reduce(
    (tot, key) => {
      const documentValue = offer.documents[key];
      return tot + documentValue.length;
    },
    0,
  );

  return (
    <DialogSimple
      buttonProps={{ label: `Documents (${documentsCount})`, primary: true }}
      title="Documents"
    >
      <UploaderArray
        doc={offer}
        documentArray={offerDocumentsArray}
        allowRequireByAdmin={false}
      />
    </DialogSimple>
  );
};
export default OfferDocuments;
