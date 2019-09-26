// @flow
import React from 'react';

import { PROMOTIONS_COLLECTION } from 'core/api/constants';
import AdminNote from 'core/components/AdminNote';
import LotsChart from './LotsChart';
import LoansChart from './LoansChart';

type PromotionManagementProps = {};

const PromotionManagement = ({
  promotion: { _id: promotionId, adminNote, promotionLots = [], loans = [] },
}: PromotionManagementProps) => (
  <div className="promotion-management card1 card-top">
    <div className="flex-row center">
      <LotsChart promotionLots={promotionLots} />
      <LoansChart loans={loans} />
    </div>
    <AdminNote
      adminNote={adminNote}
      docId={promotionId}
      collection={PROMOTIONS_COLLECTION}
    />
  </div>
);

export default PromotionManagement;
