import { Meteor } from 'meteor/meteor';
import React from 'react';
import { compose, withProps } from 'recompose';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import {
  getCurrentUserPermissionsForPromotion,
  shouldAnonymize,
} from '../../api/promotions/helpers';
import { removeUserFromPromotion, withSmartQuery } from '../../api';
import ConfirmMethod from '../ConfirmMethod';
import T from '../Translation';
import PromotionProgress from '../PromotionLotPage/PromotionProgress';
import PriorityOrder from '../PromotionLotPage/PriorityOrder';
import { createRoute } from '../../utils/routerUtils';
import PromotionProgressHeader from './PromotionProgressHeader';
import proPromotionUsers from '../../api/promotions/queries/proPromotionUsers';

const columnOptions = [
  { id: 'name' },
  { id: 'phone' },
  { id: 'email' },
  { id: 'createdAt' },
  { id: 'invitedBy' },
  { id: 'promotionProgress', label: <PromotionProgressHeader /> },
  { id: 'priorityOrder' },
  { id: 'actions' },
].map(({ id, label }) => ({
  id,
  label: label || <T id={`PromotionLotLoansTable.${id}`} />,
}));

const getColumns = ({ promotionId, promotionUsers, loan, currentUser }) => {
  const {
    _id: loanId,
    user,
    promotionProgress,
    promotionOptions = [],
    promotions,
    createdAt,
  } = loan;

  const promotion = promotions.find(({ _id }) => _id === promotionId);

  const {
    $metadata: { invitedBy },
  } = promotion;

  const invitedByName = (invitedBy
      && promotionUsers
      && !!promotionUsers.length
      && promotionUsers.find(({ _id }) => _id === invitedBy).name)
    || 'Personne';

  const permissions = getCurrentUserPermissionsForPromotion({
    promotionId,
    currentUser,
  });

  if (
    shouldAnonymize({
      currentUser,
      promotionId,
      invitedBy,
    })
    && Meteor.microservice !== 'admin'
  ) {
    return [
      <i key="name">Masqué</i>,
      <i key="phone">Masqué</i>,
      <i key="email">Masqué</i>,
      { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
      invitedByName,
      <i key="promotionProgress">Masqué</i>,
      <i key="priorityOrder">Masqué</i>,
      <span key="actions">-</span>,
    ];
  }

  return [
    user && user.name,
    user && user.phoneNumbers && user.phoneNumbers[0],
    user && user.email,
    { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
    invitedByName,
    {
      raw: promotionProgress.verificationStatus,
      label: <PromotionProgress promotionProgress={promotionProgress} />,
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
    Meteor.microservice === 'admin' || permissions.canInviteCustomers ? (
      <ConfirmMethod
        method={() => removeUserFromPromotion.run({ promotionId, loanId })}
        label={<T id="general.remove" />}
        key="remove"
      />
    ) : (
      <span key="actions">-</span>
    ),
  ];
};

const makeMapLoan = ({
  promotionId,
  history,
  promotionUsers,
  currentUser = {},
}) => (loan) => {
  const { _id: loanId } = loan;

  return {
    id: loanId,
    columns: getColumns({ promotionId, promotionUsers, loan, currentUser }),
    ...(Meteor.microservice === 'admin'
      ? {
        handleClick: () =>
          history.push(createRoute('/loans/:loanId', { loanId })),
      }
      : {}),
  };
};

export default compose(
  withRouter,
  withSmartQuery({
    query: proPromotionUsers,
    params: ({ promotionId }) => ({ promotionId }),
    queryOptions: { reactive: false },
    dataName: 'promotionUsers',
    smallLoader: true,
  }),
  withProps(({ loans, promotionId, history, promotionUsers, currentUser }) => ({
    rows: loans.map(makeMapLoan({
      promotionId,
      history,
      promotionUsers,
      currentUser,
    })),
    columnOptions,
  })),
);
