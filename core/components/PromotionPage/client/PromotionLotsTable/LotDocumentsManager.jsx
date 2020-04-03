import React from 'react';

import { S3_ACLS } from '../../../../api/files/fileConstants';
import { PROPERTIES_COLLECTION } from '../../../../api/properties/propertyConstants';
import DialogSimple from '../../../DialogSimple';
import T from '../../../Translation';
import UploaderArray from '../../../UploaderArray';

const promotionPropertyDocuments = [
  {
    id: 'promotionPropertyDocuments',
    acl: S3_ACLS.PUBLIC_READ,
    noTooltips: true,
  },
];

const LotDocumentsManager = ({ property, currentUser, documents }) => (
  <>
    <DialogSimple
      primary
      raised
      label={<T id="PromotionPage.manageDocuments" />}
      title={
        <T
          id="PromotionPage.managePropertyDocuments"
          values={{ name: property && property.name }}
        />
      }
      text={<T id="PromotionPage.managePropertyDocuments.description" />}
    >
      <UploaderArray
        doc={{ ...property, documents }}
        collection={PROPERTIES_COLLECTION}
        documentArray={promotionPropertyDocuments}
        currentUser={currentUser}
        allowRequireByAdmin={false}
      />
    </DialogSimple>
  </>
);

export default LotDocumentsManager;
