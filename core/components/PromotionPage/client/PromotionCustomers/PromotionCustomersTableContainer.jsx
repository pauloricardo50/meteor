import { Meteor } from 'meteor/meteor';

import React from 'react';
import { compose, withProps } from 'recompose';
import moment from 'moment';

import { getPromotionCustomerOwnerType } from '../../../../api/promotions/promotionClientHelpers';
import { LOANS_COLLECTION } from '../../../../api/constants';
import LoanProgressHeader from '../../../LoanProgress/LoanProgressHeader';
import LoanProgress from '../../../LoanProgress';
import T from '../../../Translation';
import { CollectionIconLink } from '../../../IconLink';
import StatusLabel from '../../../StatusLabel';
import PriorityOrder from '../PromotionLotDetail/PromotionLotLoansTable/PriorityOrder';
import PromotionCustomersTableActions from './PromotionCustomersTableActions';
import PromotionCustomer from '../PromotionCustomer';

const columnOptions = [
  { id: 'loanName' },
  { id: 'status', label: <T id="Forms.status" /> },
  { id: 'customer' },
  { id: 'createdAt' },
  { id: 'loanProgress', label: <LoanProgressHeader /> },
  { id: 'priorityOrder' },
  { id: 'actions' },
].map(({ id, label }) => ({
  id,
  label: label || <T id={`PromotionLotLoansTable.${id}`} />,
}));

const getColumns = ({
  promotionId,
  promotionUsers,
  loan,
  currentUser,
  promotionLots,
}) => {
  const {
    name: loanName,
    status,
    user,
    loanProgress,
    promotionOptions = [],
    promotions,
    createdAt,
  } = loan;

  const promotion = promotions.find(({ _id }) => _id === promotionId);

  const {
    $metadata: { invitedBy },
  } = promotion;

  const customerOwnerType = getPromotionCustomerOwnerType({
    invitedBy,
    currentUser,
  });

  return [
    {
      raw: loanName,
      label: (
        <CollectionIconLink
          relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
          noRoute={Meteor.microservice === 'pro'}
        />
      ),
    },
    {
      raw: status,
      label: <StatusLabel status={status} collection={LOANS_COLLECTION} />,
    },
    {
      raw: user.name,
      label: (
        <PromotionCustomer
          user={user}
          invitedBy={invitedBy}
          promotionUsers={promotionUsers}
        />
      ),
    },
    { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
    {
      raw: loanProgress.verificationStatus,
      label: <LoanProgress loanProgress={loanProgress} />,
    },
    {
      raw: promotionOptions.length,
      label: (
        <PriorityOrder
          promotion={promotion}
          promotionOptions={promotionOptions}
          userId={user && user._id}
        />
      ),
    },
    <PromotionCustomersTableActions
      key="actions"
      promotion={{ ...promotion, promotionLots }}
      currentUser={currentUser}
      customerOwnerType={customerOwnerType}
      loan={loan}
    />,
  ];
};

const makeMapLoan = ({
  promotionId,
  promotionUsers,
  currentUser = {},
  promotionLots,
}) => (loan) => {
  const { _id: loanId } = loan;

  return {
    id: loanId,
    columns: getColumns({
      promotionId,
      promotionUsers,
      loan,
      currentUser,
      promotionLots,
    }),
  };
};

export default compose(withProps(({
  loans,
  currentUser,
  promotion: { _id: promotionId, promotionLots, users: promotionUsers },
}) => ({
  rows: loans.map(makeMapLoan({
    promotionId,
    promotionUsers,
    currentUser,
    promotionLots,
  })),
  columnOptions,
})));
