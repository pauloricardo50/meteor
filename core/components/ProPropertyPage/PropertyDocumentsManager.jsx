// @flow
import React from 'react';

import DialogSimple from 'core/components/DialogSimple';
import T from 'core/components/Translation';
import UploaderArray from 'core/components/UploaderArray';
import { PROPERTIES_COLLECTION, S3_ACLS, ONE_KB } from 'core/api/constants';

type PropertyDocumentsManagerProps = {};

const propertyDocuments = [
  {
    id: 'propertyImages',
    acl: S3_ACLS.PUBLIC_READ,
    noTooltips: true,
    maxSize: 500 * ONE_KB,
  },
  {
    id: 'propertyDocuments',
    acl: S3_ACLS.PUBLIC_READ,
    noTooltips: true,
  },
];

const PropertyDocumentsManager = ({
  property,
}: PropertyDocumentsManagerProps) => (
  <DialogSimple
    primary
    raised
    label={<T id="ProPropertyPage.manageDocuments" />}
    title={<T id="ProPropertyPage.manageDocuments" />}
  >
    <UploaderArray
      doc={property}
      collection={PROPERTIES_COLLECTION}
      documentArray={propertyDocuments}
      allowRequireByAdmin={false}
    />
  </DialogSimple>
);

export default PropertyDocumentsManager;
