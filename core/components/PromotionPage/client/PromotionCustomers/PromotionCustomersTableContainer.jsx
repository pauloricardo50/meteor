import { Meteor } from 'meteor/meteor';

import React from 'react';
import moment from 'moment';
import { withProps } from 'recompose';

import { LOANS_COLLECTION } from '../../../../api/loans/loanConstants';
import { getPromotionCustomerOwnerType } from '../../../../api/promotions/promotionClientHelpers';
import { CollectionIconLink } from '../../../IconLink';
import StatusLabel from '../../../StatusLabel';
import T from '../../../Translation';
import PromotionCustomer from '../PromotionCustomer';
import PriorityOrder from '../PromotionLotDetail/PromotionLotLoansTable/PriorityOrder';
import InvitedByAssignDropdown from './InvitedByAssignDropdown';
import PromotionCustomersTableActions from './PromotionCustomersTableActions';

const isAdmin = Meteor.microservice === 'admin';

const columnOptions = [
  { id: 'loanName' },
  { id: 'status', label: <T id="Forms.status" /> },
  { id: 'customer' },
  isAdmin && { id: 'invitedBy' },
  { id: 'createdAt' },
  { id: 'priorityOrder' },
  { id: 'actions' },
]
  .filter(x => x)
  .map(({ id, label }) => ({
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
    _id: loanId,
    name: loanName,
    status,
    user,
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
          relatedDoc={loan}
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
    isAdmin && {
      raw: invitedBy,
      label: (
        <InvitedByAssignDropdown
          promotionUsers={promotionUsers}
          invitedBy={invitedBy}
          loanId={loanId}
          promotionId={promotionId}
        />
      ),
    },
    { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
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
  ].filter(x => x);
};

const makeMapLoan = ({
  promotionId,
  promotionUsers,
  currentUser = {},
  promotionLots,
}) => loan => {
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

export default withProps(
  ({
    loans,
    currentUser,
    promotion: { _id: promotionId, promotionLots, users: promotionUsers },
  }) => ({
    rows: loans.map(
      makeMapLoan({
        promotionId,
        promotionUsers,
        currentUser,
        promotionLots,
      }),
    ),
    columnOptions,
  }),
);
