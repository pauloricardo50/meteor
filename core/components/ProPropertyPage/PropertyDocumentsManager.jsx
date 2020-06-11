import React from 'react';

import { getPropertyDocuments } from '../../api/files/documents';
import {
  MAX_DISPLAYABLE_FILE_SIZE,
  PROPERTY_DOCUMENTS,
  S3_ACLS,
} from '../../api/files/fileConstants';
import DialogSimple from '../DialogSimple';
import T from '../Translation';
import UploaderArray from '../UploaderArray';

const propertyDocuments = property =>
  getPropertyDocuments({ id: property._id }, { doc: property }).map(doc => ({
    ...doc,
    metadata: {
      acl: S3_ACLS.PUBLIC_READ,
      maxSizeOverride:
        doc.id === PROPERTY_DOCUMENTS.PROPERTY_PICTURES
          ? MAX_DISPLAYABLE_FILE_SIZE
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
      documentArray={propertyDocuments(property)}
      allowRequireByAdmin={false}
      allowSetRoles={canModifyProperty}
    />
  </DialogSimple>
);

export default PropertyDocumentsManager;
