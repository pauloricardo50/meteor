// @flow
import React from 'react';

import { PROMOTIONS_COLLECTION } from 'core/api/constants';
import AdminNote from 'core/components/AdminNote';

type PromotionManagementProps = {};

const PromotionManagement = ({
  promotion: { _id: promotionId, adminNote },
}: PromotionManagementProps) => (
  <div className="promotion-management card1 card-top">
    <AdminNote
      adminNote={adminNote}
      docId={promotionId}
      collection={PROMOTIONS_COLLECTION}
    />
  </div>
);

export default PromotionManagement;
