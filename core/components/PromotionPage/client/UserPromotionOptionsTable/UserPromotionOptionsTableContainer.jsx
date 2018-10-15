import React from 'react';
import { compose, mapProps, withState, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import { toMoney } from '../../../../utils/conversionFunctions';
import { promotionOptionUpdate } from '../../../../api';
import T from '../../../Translation';
import PrioritySetter from './PrioritySetter';
import ClickToEditField from '../../../ClickToEditField';

const makeMapPromotionOption = ({
  isLoading,
  setLoading,
  makeChangeCustom,
}) => ({ _id: promotionOptionId, promotionLots, custom }, index, arr) => {
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
      <ClickToEditField
        placeholder="Souhaits particuliers"
        value={custom}
        onSubmit={makeChangeCustom(promotionOptionId)}
        inputProps={{ style: { width: '100%' } }}
        key="custom"
      />,
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
  { id: 'custom' },
].map(({ id }) => ({ id, label: <T id={`PromotionPage.lots.${id}`} /> }));

export default compose(
  withRouter,
  withState('isLoading', 'setLoading', false),
  withProps({
    makeChangeCustom: promotionOptionId => value =>
      promotionOptionUpdate.run({
        promotionOptionId,
        object: { custom: value },
      }),
  }),
  mapProps(({ promotion, loan, isLoading, setLoading, makeChangeCustom }) => {
    const { promotionOptions } = loan;
    // This metadata should come from the loan, but grapher bugs..
    const { priorityOrder } = promotion.loans[0].$metadata;
    return {
      rows: promotionOptions
        .sort(makeSortByPriority(priorityOrder))
        .map(makeMapPromotionOption({ isLoading, setLoading, makeChangeCustom })),
      columnOptions,
    };
  }),
);
