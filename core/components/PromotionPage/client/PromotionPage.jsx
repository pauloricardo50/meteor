// @flow
import React from 'react';
import { Meteor } from 'meteor/meteor';

import MapWithMarkerWrapper from '../../maps/MapWithMarkerWrapper';
import Button from '../../Button';
import T from '../../Translation';
import PromotionPageHeader from './PromotionPageHeader';
import ProPromotionLotsTable from './ProPromotionLotsTable';
import PromotionDocumentsManager from './PromotionDocumentsManager';
import PromotionPageDocuments from './PromotionPageDocuments';
import AdditionalLotsTable from './AdditionalLotsTable';
import CustomerAdder from './CustomerAdder';
import EmailTester from './EmailTester';
import UserPromotionTables from './UserPromotionTables';

type PromotionPageProps = {
  promotion: Object,
  currentUser: Object,
  loan: Object,
  canInviteCustomers: boolean,
  canManageDocuments: boolean,
  canSeeCustomers: boolean,
};

const PromotionPage = (props: PromotionPageProps) => {
  const {
    promotion,
    currentUser,
    loan = {},
    canInviteCustomers,
    canManageDocuments,
    canSeeCustomers,
  } = props;

  const isApp = Meteor.microservice === 'app';

  return (
    <div className="card1 promotion-page">
      <PromotionPageHeader {...props} />
      <div className="buttons flex center animated fadeIn delay-600">
        {canInviteCustomers && (
          <CustomerAdder
            promotion={promotion}
            promotionStatus={promotion.status}
          />
        )}
        {canManageDocuments && (
          <PromotionDocumentsManager
            promotion={promotion}
            currentUser={currentUser}
          />
        )}
        {canInviteCustomers && <EmailTester promotionId={promotion._id} />}
        {canSeeCustomers && (
          <Button link to={`/promotions/${promotion._id}/users`} raised primary>
            <T id="PromotionPage.users" />
          </Button>
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
      {!isApp && (
        <>
          <ProPromotionLotsTable {...props} />
          <AdditionalLotsTable {...props} />
        </>
      )}
      {isApp && <UserPromotionTables loan={loan} promotion={promotion} />}
    </div>
  );
};

export default PromotionPage;
