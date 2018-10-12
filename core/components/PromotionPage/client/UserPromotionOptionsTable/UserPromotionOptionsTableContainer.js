import React from 'react';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import { toMoney } from '../../../../utils/conversionFunctions';
import T from '../../../Translation';

const makeMapPromotionOption = ({}) => ({
  _id: promotionOptionId,
  promotionLots: { name, status, value },
}) => ({
  id: promotionOptionId,
  columns: [
    name,
    { raw: status, label: <T id={`Forms.status.${status}`} key="status" /> },
    { raw: value, label: toMoney(value) },
  ],
});

const columnOptions = [
  { id: 'name' },
  { id: 'status' },
  { id: 'totalValue' },
].map(({ id }) => ({ id, label: <T id={`PromotionPage.lots.${id}`} /> }));

export default compose(
  withRouter,
  mapProps(({ promotion, loan }) => {
    const { promotionOptions } = loan;
    return {
      rows: promotionOptions.map(makeMapPromotionOption({})),
      columnOptions,
    };
  }),
);
