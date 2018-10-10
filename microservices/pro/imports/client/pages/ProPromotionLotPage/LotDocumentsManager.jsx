// @flow
import React from 'react';

import DialogSimple from 'core/components/DialogSimple';
import UploaderArray from 'core/components/UploaderArray';
import T from 'core/components/Translation';
import {
  S3_ACLS,
  PROPERTIES_COLLECTION,
} from 'core/api/constants';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';
import propertyFiles from 'core/api/properties/queries/propertyFiles';

const promotionPropertyDocuments = [
  {
    id: 'promotionPropertyDocuments',
    acl: S3_ACLS.PUBLIC_READ,
    noTooltips: true,
  },
];

type LotDocumentsManagerProps = {};

const LotDocumentsManager = ({
  property,
  currentUser,
}: LotDocumentsManagerProps) => (
  <>
    <DialogSimple
      primary
      raised
      label={<T id="PromotionPage.manageDocuments" />}
      title={(
        <T
          id="PromotionPage.managePropertyDocuments"
          values={{ name: property.name }}
        />
      )}
      text={<T id="PromotionPage.managePropertyDocuments.description" />}
    >
      <UploaderArray
        doc={property}
        collection={PROPERTIES_COLLECTION}
        documentArray={promotionPropertyDocuments}
        currentUser={currentUser}
      />
    </DialogSimple>
  </>
);

export default mergeFilesWithQuery(
  propertyFiles,
  ({ property: { _id: propertyId } }) => ({ propertyId }),
  'property',
)(LotDocumentsManager);
