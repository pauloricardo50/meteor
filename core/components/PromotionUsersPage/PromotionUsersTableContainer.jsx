import React from 'react';
import { compose, withProps } from 'recompose';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import T from '../Translation';
import PromotionProgress from '../PromotionLotPage/PromotionProgress';
import PriorityOrder from '../PromotionLotPage/PriorityOrder';
import { createRoute } from '../../utils/routerUtils';

const columnOptions = [
  { id: 'name' },
  { id: 'phone' },
  { id: 'email' },
  { id: 'createdAt' },
  { id: 'promotionProgress' },
  { id: 'priorityOrder' },
].map(({ id }) => ({ id, label: <T id={`PromotionLotLoansTable.${id}`} /> }));

const makeMapLoan = ({ promotionId, history, isAdmin }) => (loan) => {
  const {
    _id: loanId,
    user,
    promotionProgress,
    promotionOptions = [],
    promotions,
    createdAt,
  } = loan;
  console.log('loan', loan);
  const promotion = promotions.find(({ _id }) => _id === promotionId);
  return {
    id: loanId,
    columns: [
      user && user.name,
      user && user.phoneNumbers && user.phoneNumbers[0],
      user && user.email,
      { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
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
  withProps(({ loans, promotionId, history, isAdmin }) => ({
    rows: loans.map(makeMapLoan({ promotionId, history, isAdmin })),
    columnOptions,
  })),
);
