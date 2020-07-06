import { Meteor } from 'meteor/meteor';

import React from 'react';

import Promotions from '../../../../api/promotions';
import { proPromotions } from '../../../../api/promotions/queries';
import useMeteorData from '../../../../hooks/useMeteorData';
import AdminNotes from '../../../AdminNotes';
import Loading from '../../../Loading';
import UpdateField from '../../../UpdateField';
import LoansChart from './LoansChart';
import LotsChart from './LotsChart';
import LotsValueChart from './LotsValueChart';
import PromotionRecap from './PromotionRecap';

const PromotionManagement = ({ promotion }) => {
  const { _id: promotionId, promotionLoan } = promotion;
  const { data, loading } = useMeteorData({
    query: proPromotions,
    params: {
      _id: promotionId,
      $body: {
        promotionLots: {
          lots: { value: 1 },
          name: 1,
          properties: {
            landValue: 1,
            constructionValue: 1,
            additionalMargin: 1,
            value: 1,
          },
          promotionLotGroupIds: 1,
          status: 1,
          value: 1,
        },
        loans: { createdAt: 1 },
      },
    },
    refetchOnMethodCall: false,
    type: 'single',
  });

  if (loading) {
    return <Loading />;
  }

  const { promotionLots = [], loans = [] } = data;

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
      <PromotionRecap promotion={{ ...promotion, promotionLots }} />
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
