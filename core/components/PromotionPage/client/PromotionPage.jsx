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
import UserPromotionLotsTable from './UserPromotionLotsTable';
import UserPromotionOptionsTable from './UserPromotionOptionsTable';
import CustomerAdder from './CustomerAdder';
import EmailTester from './EmailTester';
import UpdateField from '../../UpdateField';
import { COLLECTIONS } from '../../../api/constants';

type PromotionPageProps = {};

const PromotionPage = (props: PromotionPageProps) => {
  const {
    promotion,
    currentUser,
    loan = {},
    canModifyPromotion,
    canInviteCustomers,
    canManageDocuments,
    canSeeCustomers,
  } = props;
  const { residenceType } = loan;

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
      {Meteor.microservice !== 'app' && (
        <>
          <ProPromotionLotsTable {...props} />
          <AdditionalLotsTable {...props} />
        </>
      )}
      {Meteor.microservice === 'app' && (
        <div className="card1 residence-type-setter">
          {!residenceType && (
            <p>
              <T id="Forms.promotionPage.residenceTypeSetter.text" />
            </p>
          )}
          <UpdateField
            doc={loan}
            fields={['residenceType']}
            collection={COLLECTIONS.LOANS_COLLECTION}
          />
        </div>
      )}
      {Meteor.microservice === 'app' && residenceType && (
        <UserPromotionOptionsTable promotion={promotion} loan={loan} />
      )}
      {Meteor.microservice === 'app' && residenceType && (
        <UserPromotionLotsTable promotion={promotion} loan={loan} />
      )}
    </div>
  );
};

export default PromotionPage;
