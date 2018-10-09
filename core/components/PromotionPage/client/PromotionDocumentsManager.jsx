// @flow
import React from 'react';

import DialogSimple from '../../DialogSimple';
import UploaderArray from '../../UploaderArray';
import T from '../../Translation';
import { PROMOTIONS_COLLECTION, S3_ACLS } from '../../../api/constants';

type PromotionDocumentsManagerProps = {};

const PromotionDocumentsManager = ({
  promotion,
  currentUser,
}: PromotionDocumentsManagerProps) => (
  <>
    <DialogSimple
      primary
      raised
      label={<T id="PromotionPage.manageDocuments" />}
      title={<T id="PromotionPage.manageDocuments" />}
    >
      <UploaderArray
        doc={promotion}
        collection={PROMOTIONS_COLLECTION}
        documentArray={[
          { id: 'promotionImage', acl: S3_ACLS.PUBLIC_READ },
          { id: 'promotionDocuments', acl: S3_ACLS.PUBLIC_READ },
          { id: 'logos', acl: S3_ACLS.PUBLIC_READ },
        ]}
        currentUser={currentUser}
      />
    </DialogSimple>
  </>
);

export default PromotionDocumentsManager;
