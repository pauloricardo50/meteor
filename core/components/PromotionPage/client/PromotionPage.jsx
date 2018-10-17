// @flow
import React from 'react';

import MapWithMarkerWrapper from '../../maps/MapWithMarkerWrapper';
import PromotionPageHeader from './PromotionPageHeader';
import ProPromotionLotsTable from './ProPromotionLotsTable';
import PromotionDocumentsManager from './PromotionDocumentsManager';
import PromotionPageDocuments from './PromotionPageDocuments';
import AdditionalLotsTable from './AdditionalLotsTable';
import UserPromotionLotsTable from './UserPromotionLotsTable';
import UserPromotionOptionsTable from './UserPromotionOptionsTable';
import CustomerAdder from './CustomerAdder';
import EmailTester from './EmailTester';

type PromotionPageProps = {};

const PromotionPage = (props: PromotionPageProps) => {
  const { promotion, currentUser, canModify, isPro, isAdmin, loan } = props;
  console.log('promotion', promotion);
  return (
    <div className="card1 promotion-page">
      <PromotionPageHeader {...props} />
      <div className="buttons flex center animated fadeIn delay-600">
        {canModify && <CustomerAdder promotionId={promotion._id} />}
        {canModify && (
          <PromotionDocumentsManager
            promotion={promotion}
            currentUser={currentUser}
          />
        )}
        {isPro && <EmailTester promotionId={promotion._id} />}
      </div>

      <MapWithMarkerWrapper
        address1={promotion.address1}
        city={promotion.city}
        zipCode={promotion.zipCode}
        options={{ zoom: 12 }}
        className="animated fadeIn delay-800"
      />

      <PromotionPageDocuments promotion={promotion} />
      {(isPro || isAdmin) && (
        <>
          <ProPromotionLotsTable promotion={promotion} />
          <AdditionalLotsTable promotion={promotion} />
        </>
      )}
      {!isPro
        && !isAdmin && (
        <UserPromotionOptionsTable promotion={promotion} loan={loan} />
      )}
      {!isPro
        && !isAdmin && (
        <UserPromotionLotsTable promotion={promotion} loan={loan} />
      )}
    </div>
  );
};

export default PromotionPage;
