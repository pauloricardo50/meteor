import React from 'react';
import { compose, mapProps, withState } from 'recompose';
import { withRouter } from 'react-router-dom';

import { toMoney } from '../../../../utils/conversionFunctions';
import T from '../../../Translation';
import PrioritySetter from './PrioritySetter';

const makeMapPromotionOption = ({ isLoading, setLoading }) => (
  { _id: promotionOptionId, promotionLots },
  index,
  arr,
) => {
  const { name, status, value } = (promotionLots && promotionLots[0]) || {};
  return {
    id: promotionOptionId,
    columns: [
      <PrioritySetter
        index={index}
        length={arr.length}
        promotionOptionId={promotionOptionId}
        isLoading={isLoading}
        setLoading={setLoading}
        key="priorityOrder"
      />,
      name,
      { raw: status, label: <T id={`Forms.status.${status}`} key="status" /> },
      { raw: value, label: toMoney(value) },
    ],
  };
};

const makeSortByPriority = priorityOrder => (
  { _id: optionId1 },
  { _id: optionId2 },
) => priorityOrder.indexOf(optionId1) - priorityOrder.indexOf(optionId2);

const columnOptions = [
  { id: 'priorityOrder' },
  { id: 'name' },
  { id: 'status' },
  { id: 'totalValue' },
].map(({ id }) => ({ id, label: <T id={`PromotionPage.lots.${id}`} /> }));

export default compose(
  withRouter,
  withState('isLoading', 'setLoading', false),
  mapProps(({ promotion, loan, isLoading, setLoading }) => {
    const { promotionOptions } = loan;
    // This metadata should come from the loan, but grapher bugs..
    const { priorityOrder } = promotion.loans[0].$metadata;
    return {
      rows: promotionOptions
        .sort(makeSortByPriority(priorityOrder))
        .map(makeMapPromotionOption({ isLoading, setLoading })),
      columnOptions,
    };
  }),
);
