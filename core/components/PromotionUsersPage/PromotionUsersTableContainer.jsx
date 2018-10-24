import React from 'react';
import { compose, withProps } from 'recompose';

import T from '../Translation';

const columnOptions = [
  { id: 'name' },
  { id: 'phone' },
  { id: 'promotionProgress' },
  { id: 'priorityOrder' },
].map(({ id }) => ({ id, label: <T id={`PromotionLotLoansTable.${id}`} /> }));

const mapLoan = ({ _id, user, promotionProgress }) => ({
  id: _id,
  columns: [
    user && user.name,
    user && user.phoneNumbers && user.phoneNumbers[0],
    // <PromotionProgress
    //   promotionProgress={promotionProgress}
    //   key="promotionProgress"
    // />,
    'progress',
    'priority order',
  ],
});

export default compose(withProps(({ loans }) => ({
  rows: loans.map(mapLoan),
  columnOptions,
})));
