//      
import React from 'react';

import DialogSimple from 'core/components/DialogSimple';
import T from 'core/components/Translation';
import UploaderArray from 'core/components/UploaderArray';
import {
  PROPERTIES_COLLECTION,
  S3_ACLS,
  ONE_KB,
  PROPERTY_DOCUMENTS,
} from 'core/api/constants';
import { getPropertyDocuments } from 'core/api/files/documents';

                                        

const propertyDocuments = property =>
  getPropertyDocuments({ id: property._id }, { doc: property }).map(doc => ({
    ...doc,
    metadata: {
      acl: S3_ACLS.PUBLIC_READ,
      maxSize:
        doc.id === PROPERTY_DOCUMENTS.PROPERTY_PICTURES
          ? 500 * ONE_KB
          : undefined,
    },
  }));

const PropertyDocumentsManager = ({
  property,
}                               ) => (
  <DialogSimple
    primary
    raised
    label={<T id="ProPropertyPage.manageDocuments" />}
    title={<T id="ProPropertyPage.manageDocuments" />}
  >
    <UploaderArray
      doc={property}
      collection={PROPERTIES_COLLECTION}
      documentArray={propertyDocuments(property)}
      allowRequireByAdmin={false}
    />
  </DialogSimple>
);

export default PropertyDocumentsManager;
