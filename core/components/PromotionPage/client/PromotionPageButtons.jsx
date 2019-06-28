// @flow
import React from 'react';

import { Meteor } from 'meteor/meteor';
import Button from '../../Button';
import T from '../../Translation';
import CustomerAdder from './CustomerAdder';
import EmailTester from './EmailTester';
import PromotionDocumentsManager from './PromotionDocumentsManager';
import PromotionLoanLinker from './PromotionLoanLinker/PromotionLoanLinker';

type PromotionPageButtonsProps = {};

const PromotionPageButtons = ({
  promotion,
  currentUser,
  canInviteCustomers,
  canManageDocuments,
  canSeeCustomers,
}: PromotionPageButtonsProps) => (
  <div className="buttons flex center animated fadeIn delay-600">
    {canInviteCustomers && (
      <CustomerAdder promotion={promotion} promotionStatus={promotion.status} />
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
    {Meteor.microservice === 'admin' && (
      <PromotionLoanLinker promotion={promotion} />
    )}
  </div>
);

export default PromotionPageButtons;
