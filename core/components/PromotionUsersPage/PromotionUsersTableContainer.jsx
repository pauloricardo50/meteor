import React from 'react';
import { compose, withProps } from 'recompose';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

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

const makeMapLoan = ({
  promotionId,
  history,
  isAdmin,
  promotionUsers,
}) => (loan) => {
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
    $metadata: { invitedBy = '' },
  } = promotion;
  return {
    id: loanId,
    columns: [
      user && user.name,
      user && user.phoneNumbers && user.phoneNumbers[0],
      user && user.email,
      { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
      invitedBy
        && promotionUsers
        && !!promotionUsers.length
        && promotionUsers.find(({ _id }) => _id === invitedBy).name,
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
      <ConfirmMethod
        method={() => removeUserFromPromotion.run({ promotionId, loanId })}
        label={<T id="general.remove" />}
        key="remove"
      />,
    ],
    ...(isAdmin
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
  withProps(({ loans, promotionId, history, isAdmin, promotionUsers }) => ({
    rows: loans.map(makeMapLoan({ promotionId, history, isAdmin, promotionUsers })),
    columnOptions,
  })),
);
