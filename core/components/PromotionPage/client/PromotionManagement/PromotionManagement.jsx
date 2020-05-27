import { Meteor } from 'meteor/meteor';

import React from 'react';

import Promotions from '../../../../api/promotions';
import AdminNotes from '../../../AdminNotes';
import UpdateField from '../../../UpdateField';
import LoansChart from './LoansChart';
import LotsChart from './LotsChart';
import LotsValueChart from './LotsValueChart';
import PromotionRecap from './PromotionRecap';

const PromotionManagement = ({ promotion }) => {
  const { promotionLots = [], loans = [], promotionLoan } = promotion;
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
          title="Notes sur le dossier de développement"
        />
      )}
    </div>
  );
};

export default PromotionManagement;
