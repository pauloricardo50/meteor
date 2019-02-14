import { Meteor } from 'meteor/meteor';
import React from 'react';
import { compose, withProps, mapProps } from 'recompose';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import proPromotionOptions from 'core/api/promotionOptions/queries/proPromotionOptions';
import T from 'core/components/Translation';
import { CollectionIconLink } from 'core/components/IconLink';
import PromotionLotAttributer from './PromotionLotAttributer';
import PriorityOrder from './PriorityOrder';
import PromotionProgress from './PromotionProgress';
import PromotionProgressHeader from '../PromotionUsersPage/PromotionProgressHeader';
import { LOANS_COLLECTION } from '../../api/constants';
import {
  getPromotionCustomerOwningGroup,
} from '../../api/promotions/promotionClientHelpers';

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
    user,
    promotionProgress,
    promotionOptions = [],
    promotions,
  } = loan;

  const promotion = promotions.find(({ _id }) => _id === promotionId);

  const {
    $metadata: { invitedBy },
  } = promotion;

  const customerOwningGroup = getPromotionCustomerOwningGroup({
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
    Meteor.microservice === 'admin'
      ? user && (
        <CollectionIconLink
          relatedDoc={{
            ...loan,
            name: user.name,
            collection: LOANS_COLLECTION,
          }}
        />
      )
      : user && user.name,
    { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
    user && user.phoneNumbers && user.phoneNumbers[0],
    user && user.email,
    {
      raw: promotionProgress.verificationStatus,
      label: <PromotionProgress promotionProgress={promotionProgress} />,
    },
    custom,
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
      customerOwningGroup={customerOwningGroup}
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
  { id: 'loanName' },
  { id: 'name' },
  { id: 'date' },
  { id: 'phone' },
  { id: 'email' },
  { id: 'promotionProgress', label: <PromotionProgressHeader /> },
  { id: 'custom' },
  { id: 'priorityOrder' },
  { id: 'attribute' },
].map(({ id, label }) => ({
  id,
  label: label || <T id={`PromotionLotLoansTable.${id}`} />,
}));

export default compose(
  mapProps(({ promotionOptions = [], promotionLot, canModify, isAdmin, currentUser }) => ({
    promotionOptionIds: promotionOptions.map(({ _id }) => _id),
    promotionLot,
    canModify,
    isAdmin,
    currentUser,
  })),
  withSmartQuery({
    query: proPromotionOptions,
    params: ({ promotionOptionIds }) => ({ promotionOptionIds }),
    queryOptions: { reactive: false },
    dataName: 'promotionOptions',
  }),
  withRouter,
  withProps(({ promotionOptions, promotionLot, currentUser }) => ({
    rows: promotionOptions.map(makeMapOption({ promotionLot, currentUser })),
    columnOptions,
  })),
);
