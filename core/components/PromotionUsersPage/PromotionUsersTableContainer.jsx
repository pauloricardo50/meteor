import React from 'react';
import { compose, withProps } from 'recompose';
import moment from 'moment';

import T from '../Translation';
import PromotionProgress from '../PromotionLotPage/PromotionProgress';
import PriorityOrder from '../PromotionLotPage/PriorityOrder';

const columnOptions = [
  { id: 'name' },
  { id: 'phone' },
  { id: 'createdAt' },
  { id: 'promotionProgress' },
  { id: 'priorityOrder' },
].map(({ id }) => ({ id, label: <T id={`PromotionLotLoansTable.${id}`} /> }));

const makeMapLoan = promotionId => (loan) => {
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
  };
};

export default compose(withProps(({ loans, promotionId }) => ({
  rows: loans.map(makeMapLoan(promotionId)),
  columnOptions,
})));
