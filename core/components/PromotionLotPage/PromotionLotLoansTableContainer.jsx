import { Meteor } from 'meteor/meteor';
import React from 'react';
import { compose, withProps, mapProps } from 'recompose';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import withSmartQuery from '../../api/containerToolkit/withSmartQuery';
import { proPromotionOptions } from '../../api/promotionOptions/queries';
import T from '../Translation';
import { CollectionIconLink } from '../IconLink';
import LoanProgress from '../LoanProgress/LoanProgress';
import LoanProgressHeader from '../LoanProgress/LoanProgressHeader';
import PromotionLotAttributer from './PromotionLotAttributer';
import PriorityOrder from './PriorityOrder';
import { LOANS_COLLECTION, USERS_COLLECTION } from '../../api/constants';
import { getPromotionCustomerOwnerType } from '../../api/promotions/promotionClientHelpers';
import StatusLabel from '../StatusLabel/StatusLabel';
import { getUserNameAndOrganisation } from '../../api/helpers';

const getColumns = ({ promotionLot, promotionOption, currentUser }) => {
  const {
    _id: promotionLotId,
    status: lotStatus,
    promotion: { _id: promotionId },
    attributedTo,
    name,
  } = promotionLot;
  const { loan, custom, createdAt, solvency } = promotionOption;
  const {
    _id: loanId,
    name: loanName,
    status,
    user,
    loanProgress,
    promotionOptions = [],
    promotions,
  } = loan;

  const promotion = promotions.find(({ _id }) => _id === promotionId);

  const {
    $metadata: { invitedBy },
    users: promotionUsers = [],
  } = promotion;

  const invitedByUser = invitedBy
    && promotionUsers
    && (!!promotionUsers.length
      && promotionUsers.find(({ _id }) => _id === invitedBy));

  const userName = invitedByUser
    ? getUserNameAndOrganisation({ user: invitedByUser })
    : 'Personne';

  const customerOwnerType = getPromotionCustomerOwnerType({
    invitedBy,
    currentUser,
  });

  return [
    Meteor.microservice === 'admin' ? (
      <CollectionIconLink
        relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
      />
    ) : (
      loanName
    ),
    {
      raw: status,
      label: <StatusLabel status={status} collection={LOANS_COLLECTION} />,
    },
    {
      raw: user.name,
      label:
        Meteor.microservice === 'admin'
          ? user && (
            <CollectionIconLink
              relatedDoc={{
                ...user,
                collection: USERS_COLLECTION,
              }}
            />
          )
          : user && user.name,
    },
    user && user.phoneNumbers && user.phoneNumbers[0],
    user && user.email,
    { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
    { raw: userName, label: userName },
    {
      raw: loanProgress.verificationStatus,
      label: <LoanProgress loanProgress={loanProgress} />,
    },
    custom,
    {
      raw: promotionOptions.length,
      label: (
        <PriorityOrder
          promotion={promotion}
          promotionOptions={promotionOptions}
          userId={user && user._id}
          currentId={promotionLotId}
        />
      ),
    },
    <PromotionLotAttributer
      promotionLotId={promotionLotId}
      loanId={loanId}
      promotionLotStatus={lotStatus}
      attributedToId={attributedTo && attributedTo._id}
      userName={user && user.name}
      solvency={solvency}
      promotionLotName={name}
      currentUser={currentUser}
      promotion={promotion}
      customerOwnerType={customerOwnerType}
      key="promotionLotAttributer"
    />,
  ];
};

const makeMapOption = ({ promotionLot, currentUser }) => (promotionOption) => {
  const { _id: promotionOptionId } = promotionOption;

  return {
    id: promotionOptionId,
    columns: getColumns({ promotionLot, promotionOption, currentUser }),
  };
};

const columnOptions = [
  { id: 'loanName', style: { whiteSpace: 'nowrap' } },
  { id: 'status', label: <T id="Forms.status" /> },
  { id: 'name' },
  { id: 'phone' },
  { id: 'email' },
  { id: 'date' },
  { id: 'invitedBy' },
  { id: 'loanProgress', label: <LoanProgressHeader /> },
  { id: 'custom' },
  { id: 'priorityOrder' },
  { id: 'attribute' },
].map(({ id, label }) => ({
  id,
  label: label || <T id={`PromotionLotLoansTable.${id}`} />,
}));

export default compose(
  mapProps(({ promotionOptions = [], promotionLot, currentUser }) => ({
    promotionOptionIds: promotionOptions.map(({ _id }) => _id),
    promotionLot,
    currentUser,
  })),
  withSmartQuery({
    query: proPromotionOptions,
    params: ({ promotionOptionIds }) => ({ promotionOptionIds }),
    queryOptions: { reactive: false, shouldRefetch: () => false },
    dataName: 'promotionOptions',
  }),
  withRouter,
  withProps(({ promotionOptions = [], promotionLot, currentUser }) => ({
    rows: promotionOptions.map(makeMapOption({ promotionLot, currentUser })),
    columnOptions,
  })),
);
