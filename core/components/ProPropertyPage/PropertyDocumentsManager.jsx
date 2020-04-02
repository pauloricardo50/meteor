import React from 'react';

import { getPropertyDocuments } from '../../api/files/documents';
import {
  ONE_KB,
  PROPERTY_DOCUMENTS,
  S3_ACLS,
} from '../../api/files/fileConstants';
import { PROPERTIES_COLLECTION } from '../../api/properties/propertyConstants';
import DialogSimple from '../DialogSimple';
import T from '../Translation';
import UploaderArray from '../UploaderArray';

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

const PropertyDocumentsManager = ({ property, canModifyProperty }) => (
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
      allowSetRoles={canModifyProperty}
    />
  </DialogSimple>
);

export default PropertyDocumentsManager;
