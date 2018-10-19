import React from 'react';
import { compose, mapProps, withState, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import { createRoute } from '../../../../utils/routerUtils';
import { toMoney } from '../../../../utils/conversionFunctions';
import { promotionOptionUpdate } from '../../../../api';
import T from '../../../Translation';
import PrioritySetter from './PrioritySetter';
import ClickToEditField from '../../../ClickToEditField';
import StatusLabel from '../../../StatusLabel';
import { PROMOTION_LOTS_COLLECTION } from '../../../../api/constants';
import { getLabelSuffix } from '../utils';

const makeMapPromotionOption = ({
  isLoading,
  setLoading,
  makeChangeCustom,
  promotionId,
  loanId,
  history,
  isDashboardTable = false,
}) => (
  { _id: promotionOptionId, promotionLots, custom, attributedToMe },
  index,
  arr,
) => {
  const { name, status, value } = (promotionLots && promotionLots[0]) || {};
  return {
    id: promotionOptionId,
    columns: [
      <div key="priorityOrder" onClick={e => e.stopPropagation()}>
        <PrioritySetter
          index={index}
          length={arr.length}
          promotionOptionId={promotionOptionId}
          isLoading={isLoading}
          setLoading={setLoading}
          allowChange={!isDashboardTable}
        />
      </div>,
      name,
      {
        raw: status,
        label: (
          <StatusLabel
            suffix={getLabelSuffix({ attributedToMe, status })}
            status={status}
            collection={PROMOTION_LOTS_COLLECTION}
          />
        ),
      },
      { raw: value, label: toMoney(value) },
      !isDashboardTable && (
        <div key="custom" onClick={e => e.stopPropagation()}>
          <ClickToEditField
            placeholder={<T id="Forms.promotionOptions.custom" />}
            value={custom}
            onSubmit={makeChangeCustom(promotionOptionId)}
            inputProps={{ style: { width: '100%' } }}
          />
        </div>
      ),
    ].filter(x => x !== false),

    handleClick: (event) => {
      event.stopPropagation();
      event.preventDefault();
      history.push(createRoute(
        '/loans/:loanId/promotions/:promotionId/promotionOptions/:promotionOptionId',
        {
          loanId,
          promotionId,
          promotionOptionId,
        },
      ));
    },
  };
};

const makeSortByPriority = priorityOrder => (
  { _id: optionId1 },
  { _id: optionId2 },
) => priorityOrder.indexOf(optionId1) - priorityOrder.indexOf(optionId2);

const columnOptions = (isDashboardTable = false) =>
  [
    { id: 'priorityOrder' },
    { id: 'name' },
    { id: 'status' },
    { id: 'totalValue' },
    !isDashboardTable && { id: 'custom', style: { maxWidth: '400px' } },
  ]
    .filter(x => x !== false)
    .map(({ id, ...rest }) => ({
      ...rest,
      id,
      label: <T id={`PromotionPage.lots.${id}`} />,
    }));

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
  mapProps(({
    promotion,
    loan,
    isLoading,
    setLoading,
    makeChangeCustom,
    history,
    isDashboardTable,
  }) => {
    const { promotionOptions } = loan;
    // This metadata should come from the loan, but grapher bugs..
    const { priorityOrder } = promotion.loans[0].$metadata;
    return {
      rows: promotionOptions.sort(makeSortByPriority(priorityOrder)).map(makeMapPromotionOption({
        isLoading,
        setLoading,
        makeChangeCustom,
        promotionId: promotion._id,
        loanId: loan._id,
        history,
        isDashboardTable,
      })),
      columnOptions: columnOptions(isDashboardTable),
    };
  }),
);
