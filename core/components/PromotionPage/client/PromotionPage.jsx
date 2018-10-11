// @flow
import React from 'react';

import MapWithMarkerWrapper from '../../maps/MapWithMarkerWrapper';
import T from '../../Translation';
import Button from '../../Button';
import PromotionPageHeader from './PromotionPageHeader';
import ProPromotionLotsTable from './ProPromotionLotsTable';
import PromotionDocumentsManager from './PromotionDocumentsManager';
import PromotionPageDocuments from './PromotionPageDocuments';
import UserPromotionLotsTable from './UserPromotionLotsTable';
import CustomerAdder from './CustomerAdder';

type PromotionPageProps = {};

const PromotionPage = (props: PromotionPageProps) => {
  const { promotion, currentUser, canModify, isPro } = props;
  console.log('promotion', promotion);
  return (
    <div className="card1 promotion-page">
      <PromotionPageHeader {...props} />
      <div className="buttons flex center animated fadeIn delay-600">
        {canModify && <CustomerAdder />}
        {canModify && (
          <PromotionDocumentsManager
            promotion={promotion}
            currentUser={currentUser}
          />
        )}
      </div>

      <MapWithMarkerWrapper
        address1={promotion.address1}
        city={promotion.city}
        zipCode={promotion.zipCode}
        options={{ zoom: 12 }}
        className="animated fadeIn delay-800"
      />

      <PromotionPageDocuments promotion={promotion} />
      {isPro && <ProPromotionLotsTable promotion={promotion} />}
      {!isPro && <UserPromotionLotsTable promotion={promotion} />}
    </div>
  );
};

export default PromotionPage;
