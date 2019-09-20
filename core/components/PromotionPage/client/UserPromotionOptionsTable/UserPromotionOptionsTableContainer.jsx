import React from 'react';
import {
  compose,
  mapProps,
  withState,
  withProps,
  withStateHandlers,
} from 'recompose';
import { withRouter } from 'react-router-dom';

import { toMoney } from '../../../../utils/conversionFunctions';
import { promotionOptionUpdate } from '../../../../api';
import T from '../../../Translation';
import ClickToEditField from '../../../ClickToEditField';
import StatusLabel from '../../../StatusLabel';
import {
  PROMOTION_LOTS_COLLECTION,
  PROMOTION_LOT_STATUS,
  PROMOTION_STATUS,
  PROMOTION_OPTIONS_COLLECTION,
} from '../../../../api/constants';
import UpdateField from '../../../UpdateField';
import PrioritySetter from './PrioritySetter';

const getLotsAttributedToMe = promotionOptions =>
  promotionOptions.filter(({ attributedToMe }) => attributedToMe);

const isAnyLotAttributedToMe = promotionOptions =>
  getLotsAttributedToMe(promotionOptions).length > 0;

const allowEditingCustom = ({ attributedToMe, status, promotionStatus }) =>
  !attributedToMe
  && status === PROMOTION_LOT_STATUS.AVAILABLE
  && promotionStatus === PROMOTION_STATUS.OPEN;

const makeMapPromotionOption = ({
  isLoading,
  setLoading,
  makeChangeCustom,
  isDashboardTable = false,
  promotionStatus,
  isAdmin,
  setPromotionOptionModal,
}) => (
  { _id: promotionOptionId, promotionLots, custom, attributedToMe, solvency },
  index,
  arr,
) => {
  const { name, status, reducedStatus, value } = (promotionLots && promotionLots[0]) || {};
  return {
    id: promotionOptionId,
    columns: [
      !attributedToMe && promotionStatus === PROMOTION_STATUS.OPEN && (
        <div key="priorityOrder" onClick={e => e.stopPropagation()}>
          <PrioritySetter
            index={index}
            length={arr.length}
            promotionOptionId={promotionOptionId}
            isLoading={isLoading}
            setLoading={setLoading}
            allowChange={!isDashboardTable}
          />
        </div>
      ),
      { raw: name, label: name },
      {
        raw: reducedStatus,
        label: (
          <StatusLabel
            status={reducedStatus}
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
            allowEditing={allowEditingCustom({
              attributedToMe,
              status,
              promotionStatus,
            })}
          />
        </div>
      ),
      !!isAdmin && (
        <UpdateField
          doc={{ _id: promotionOptionId, solvency }}
          collection={PROMOTION_OPTIONS_COLLECTION}
          fields={['solvency']}
        />
      ),
    ].filter(x => x !== false),

    handleClick: (event) => {
      setPromotionOptionModal(promotionOptionId);
    },
  };
};

const makeSortByPriority = priorityOrder => (
  { _id: optionId1 },
  { _id: optionId2 },
) => priorityOrder.indexOf(optionId1) - priorityOrder.indexOf(optionId2);

const columnOptions = ({
  isDashboardTable = false,
  isLotAttributedToMe,
  promotionStatus,
  isAdmin,
}) =>
  [
    !isLotAttributedToMe
      && promotionStatus === PROMOTION_STATUS.OPEN && {
      id: 'priorityOrder',
      ...(isDashboardTable && { style: { width: '10%' } }),
    },
    { id: 'name' },
    { id: 'status' },
    { id: 'totalValue', style: { whiteSpace: 'nowrap' } },
    !isDashboardTable && { id: 'custom', style: { maxWidth: '400px' } },
    !!isAdmin && { id: 'solvency' },
  ]
    .filter(x => x !== false)
    .map(({ id, ...rest }) => ({
      ...rest,
      id,
      label:
        isDashboardTable && id === 'priorityOrder' ? (
          '#'
        ) : (
          <T id={`PromotionPage.lots.${id}`} />
        ),
      ...(isDashboardTable
        && id !== 'priorityOrder' && { style: { width: '30%' }, padding: 'none' }),
    }));

const addState = withStateHandlers(
  {},
  {
    setStatus: () => status => ({ status }),
    setPromotionOptionModal: () => promotionOptionModal => ({
      promotionOptionModal,
    }),
  },
);

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
  addState,
  mapProps(({
    promotion,
    loan,
    isLoading,
    setLoading,
    makeChangeCustom,
    isDashboardTable,
    isAdmin,
    className,
    setPromotionOptionModal,
    ...rest
  }) => {
    const { promotionOptions } = loan;
    const options = isAnyLotAttributedToMe(promotionOptions)
      ? getLotsAttributedToMe(promotionOptions)
      : promotionOptions;

    let priorityOrder = promotion.loans
        && promotion.loans[0]
        && promotion.loans[0].$metadata.priorityOrder;

    // On admin, the priorityOrder is on the promotion itself
    if (!priorityOrder) {
      priorityOrder = promotion.$metadata && promotion.$metadata.priorityOrder;
    }

    return {
      rows: options.sort(makeSortByPriority(priorityOrder)).map(makeMapPromotionOption({
        isLoading,
        setLoading,
        makeChangeCustom,
        isDashboardTable,
        promotionStatus: promotion.status,
        isAdmin,
        setPromotionOptionModal,
      })),
      columnOptions: columnOptions({
        isDashboardTable,
        isLotAttributedToMe: isAnyLotAttributedToMe(promotionOptions),
        promotionStatus: promotion.status,
        isAdmin,
      }),
      setCustom: (promotionOptionId, value) =>
        promotionOptionUpdate.run({
          promotionOptionId,
          object: { custom: value },
        }),
      isDashboardTable,
      className,
      promotionOptions,
      setPromotionOptionModal,
      promotion,
      ...rest,
    };
  }),
);
