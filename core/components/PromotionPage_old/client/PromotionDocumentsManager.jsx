// @flow
import React from 'react';

import DialogSimple from '../../DialogSimple';
import UploaderArray from '../../UploaderArray';
import T from '../../Translation';
import { PROMOTIONS_COLLECTION, S3_ACLS, ONE_KB } from '../../../api/constants';

const promotionDocuments = [
  {
    id: 'promotionImage',
    acl: S3_ACLS.PUBLIC_READ,
    noTooltips: true,
    maxSize: 500 * ONE_KB,
  },
  {
    id: 'promotionDocuments',
    acl: S3_ACLS.PUBLIC_READ,
    noTooltips: true,
  },
  { id: 'logos', acl: S3_ACLS.PUBLIC_READ, noTooltips: true },
];

type PromotionDocumentsManagerProps = {};

const PromotionDocumentsManager = ({
  promotion,
  currentUser,
}: PromotionDocumentsManagerProps) => (
  <DialogSimple
    primary
    raised
    label={<T id="PromotionPage.manageDocuments" />}
    title={<T id="PromotionPage.manageDocuments" />}
  >
    <UploaderArray
      doc={promotion}
      collection={PROMOTIONS_COLLECTION}
      documentArray={promotionDocuments}
      currentUser={currentUser}
      allowRequireByAdmin={false}
    />
  </DialogSimple>
);

export default PromotionDocumentsManager;
