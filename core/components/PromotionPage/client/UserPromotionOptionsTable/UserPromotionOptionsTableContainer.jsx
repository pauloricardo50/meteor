import React from 'react';
import { compose, mapProps, withState } from 'recompose';
import { withRouter } from 'react-router-dom';

import { toMoney } from '../../../../utils/conversionFunctions';
import T from '../../../Translation';
import StatusLabel from '../../../StatusLabel';
import {
  PROMOTION_OPTIONS_COLLECTION,
  PROMOTION_STATUS,
} from '../../../../api/constants';
import PrioritySetter from './PrioritySetter';
import PromotionLotReservation from '../PromotionLotDetail/PromotionLotLoansTable/PromotionLotReservation';
import RequestReservation from './RequestReservation';

const makeMapPromotionOption = ({
  isLoading,
  setLoading,
  isDashboardTable = false,
  promotionStatus,
  isAdmin,
  loan,
  promotion,
}) => (promotionOption, index, arr) => {
  const {
    _id: promotionOptionId,
    promotionLots,
    loan: {
      user: { _id: userId },
    },
    status,
  } = promotionOption;
  const { name, value } = (promotionLots && promotionLots[0]) || {};
  return {
    id: promotionOptionId,
    promotionOption,
    columns: [
      promotionStatus === PROMOTION_STATUS.OPEN && (
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
        raw: status,
        label: (
          <StatusLabel
            status={status}
            collection={PROMOTION_OPTIONS_COLLECTION}
          />
        ),
      },
      { raw: value, label: toMoney(value) },
      !isDashboardTable && (
        <RequestReservation
          promotionOptionId={promotionOptionId}
          promotionLotName={name}
          status={status}
        />
      ),

      !!isAdmin && (
        <PromotionLotReservation
          loan={loan}
          promotion={promotion}
          promotionOption={promotionOption}
          key="promotionLotAttributer"
        />
      ),
    ].filter(x => x !== false),
  };
};

const makeSortByPriority = priorityOrder => (
  { _id: optionId1 },
  { _id: optionId2 },
) => priorityOrder.indexOf(optionId1) - priorityOrder.indexOf(optionId2);

const columnOptions = ({
  isDashboardTable = false,
  promotionStatus,
  isAdmin,
}) =>
  [
    promotionStatus === PROMOTION_STATUS.OPEN && {
      id: 'priorityOrder',
      ...(isDashboardTable && { style: { width: '10%' } }),
    },
    { id: 'name' },
    { id: 'status' },
    { id: 'totalValue', style: { whiteSpace: 'nowrap' } },
    !isDashboardTable && { id: 'requestReservation' },
    !!isAdmin && { id: 'reservation' },
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

export default compose(
  withRouter,
  withState('isLoading', 'setLoading', false),
  mapProps(({
    promotion,
    loan,
    isLoading,
    setLoading,
    isDashboardTable,
    isAdmin,
    className,
    ...rest
  }) => {
    const { promotionOptions } = loan;

    let priorityOrder = promotion.loans
        && promotion.loans[0]
        && promotion.loans[0].$metadata.priorityOrder;

    // On admin, the priorityOrder is on the promotion itself
    if (!priorityOrder) {
      priorityOrder = promotion.$metadata && promotion.$metadata.priorityOrder;
    }

    return {
      rows: promotionOptions.sort(makeSortByPriority(priorityOrder)).map(makeMapPromotionOption({
        isLoading,
        setLoading,
        isDashboardTable,
        promotionStatus: promotion.status,
        isAdmin,
        loan,
        promotion,
      })),
      columnOptions: columnOptions({
        isDashboardTable,
        promotionStatus: promotion.status,
        isAdmin,
      }),
      isDashboardTable,
      className,
      promotionOptions,
      promotion,
      ...rest,
    };
  }),
);
