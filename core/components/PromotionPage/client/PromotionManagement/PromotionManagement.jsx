// @flow
import React, { useContext } from 'react';

import { PROMOTIONS_COLLECTION } from 'core/api/constants';
import AdminNote from 'core/components/AdminNote';
import LotsChart from './LotsChart';
import LoansChart from './LoansChart';
import PromotionMetadataContext from '../PromotionMetadata';
import LotsValueChart from './LotsValueChart';
import PromotionRecap from './PromotionRecap';

type PromotionManagementProps = {};

const PromotionManagement = ({ promotion }: PromotionManagementProps) => {
  const {
    permissions: { canModifyAdminNote },
  } = useContext(PromotionMetadataContext);
  const {
    _id: promotionId,
    adminNote,
    promotionLots = [],
    loans = [],
  } = promotion;
  return (
    <div className="promotion-management card1 card-top">
      <PromotionRecap promotion={promotion} />
      <div className="promotion-management-charts">
        <LotsChart promotionLots={promotionLots} />
        <LotsValueChart promotionLots={promotionLots} />
        <LoansChart loans={loans} />
      </div>
      <h3>Notes e-Potek</h3>
      <AdminNote
        adminNote={adminNote}
        docId={promotionId}
        collection={PROMOTIONS_COLLECTION}
        allowEditing={canModifyAdminNote}
      />
    </div>
  );
};

export default PromotionManagement;
