import { Meteor } from 'meteor/meteor';

import React, { useContext } from 'react';

import { LOANS_COLLECTION } from '../../../../api/loans/loanConstants';
import Promotions from '../../../../api/promotions';
import { PROMOTIONS_COLLECTION } from '../../../../api/promotions/promotionConstants';
import AdminNote from '../../../AdminNote';
import AdminNotes from '../../../AdminNotes';
import UpdateField from '../../../UpdateField';
import PromotionMetadataContext from '../PromotionMetadata';
import LoansChart from './LoansChart';
import LotsChart from './LotsChart';
import LotsValueChart from './LotsValueChart';
import PromotionRecap from './PromotionRecap';

const PromotionManagement = ({ promotion }) => {
  const {
    permissions: { canModifyAdminNote },
  } = useContext(PromotionMetadataContext);
  const {
    _id: promotionId,
    adminNote,
    promotionLots = [],
    loans = [],
    promotionLoan,
  } = promotion;
  return (
    <div className="promotion-management card1 card-top">
      {Meteor.microservice === 'admin' && (
        <div className="promotion-management-statuses">
          <UpdateField
            collection={Promotions}
            doc={promotion}
            fields={['projectStatus', 'authorizationStatus']}
          />
        </div>
      )}
      <PromotionRecap promotion={promotion} />
      <div className="promotion-management-charts">
        <LotsChart promotionLots={promotionLots} />
        <LotsValueChart promotionLots={promotionLots} />
        <LoansChart loans={loans} />
      </div>
      {promotionLoan && (
        <AdminNotes
          doc={promotionLoan}
          collection={LOANS_COLLECTION}
          title="Notes sur le dossier de développement"
        />
      )}
      {(Meteor.microservice === 'admin' || adminNote) && <h3>Notes e-Potek</h3>}
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
