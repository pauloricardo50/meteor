import { Meteor } from 'meteor/meteor';

import React from 'react';
import { compose, withProps } from 'recompose';
import moment from 'moment';

import { proPromotions, proPromotionUsers } from '../../api/promotions/queries';
import { withSmartQuery } from '../../api';

import { getPromotionCustomerOwnerType } from '../../api/promotions/promotionClientHelpers';
import { getUserNameAndOrganisation } from '../../api/helpers';
import { LOANS_COLLECTION } from '../../api/constants';
import LoanProgressHeader from '../LoanProgress/LoanProgressHeader';
import LoanProgress from '../LoanProgress/LoanProgress';
import PriorityOrder from '../PromotionLotPage/PriorityOrder';
import T from '../Translation';
import { CollectionIconLink } from '../IconLink';
import InvitedByAssignDropdown from './InvitedByAssignDropdown';
import PromotionUsersTableActions from './PromotionUsersTableActions';
import StatusLabel from '../StatusLabel/StatusLabel';

const columnOptions = [
  { id: 'loanName' },
  { id: 'status', label: <T id="Forms.status" /> },
  { id: 'name' },
  { id: 'phone' },
  { id: 'email' },
  { id: 'createdAt' },
  { id: 'invitedBy' },
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
    _id: loanId,
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

  const invitedByUser = invitedBy
    && promotionUsers
    && (!!promotionUsers.length
      && promotionUsers.find(({ _id }) => _id === invitedBy));

  const userName = invitedByUser
    ? getUserNameAndOrganisation({ user: invitedByUser })
    : 'Personne';

  return [
    {
      raw: loanName,
      label:
        Meteor.microservice === 'admin' ? (
          <CollectionIconLink
            relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
          />
        ) : (
          loanName
        ),
    },
    {
      raw: status,
      label: <StatusLabel status={status} collection={LOANS_COLLECTION} />,
    },
    user && user.name,
    user && user.phoneNumbers && user.phoneNumbers[0],
    user && user.email,
    { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
    {
      raw: userName,
      label:
        Meteor.microservice === 'admin' ? (
          <InvitedByAssignDropdown
            promotionUsers={promotionUsers}
            invitedBy={invitedBy}
            invitedByName={userName}
            loanId={loanId}
            promotionId={promotionId}
          />
        ) : (
          userName
        ),
    },
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
    <PromotionUsersTableActions
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

export default compose(
  withSmartQuery({
    query: proPromotionUsers,
    params: ({ promotionId }) => ({ _id: promotionId }),
    queryOptions: { reactive: false },
    dataName: 'promotionUsers',
    smallLoader: true,
  }),
  withSmartQuery({
    query: proPromotions,
    params: ({ promotionId }) => ({
      _id: promotionId,
      simple: true,
      $body: { promotionLots: { name: 1 } },
    }),
    queryOptions: { single: true, shouldRefetch: () => false },
    dataName: 'simplePromotion',
    refetchOnMethodCall: false,
  }),
  withProps(({
    loans,
    promotionId,
    promotionUsers,
    currentUser,
    simplePromotion: { promotionLots },
  }) => ({
    rows: loans.map(makeMapLoan({
      promotionId,
      promotionUsers,
      currentUser,
      promotionLots,
    })),
    columnOptions,
  })),
);
