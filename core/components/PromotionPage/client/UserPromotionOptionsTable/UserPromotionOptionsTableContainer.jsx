import React, { useState } from 'react';
import { mapProps } from 'recompose';

import { PROMOTION_STATUS } from '../../../../api/promotions/promotionConstants';
import { toMoney } from '../../../../utils/conversionFunctions';
import StatusLabel from '../../../StatusLabel';
import T from '../../../Translation';
import PromotionLotReservation from '../PromotionLotDetail/PromotionLotLoansTable/PromotionLotReservation/PromotionLotReservation';
import { getPromotionLotValue } from '../PromotionManagement/helpers';
import PrioritySetter from './PrioritySetter';
import RequestReservation from './RequestReservation';

const makeMapPromotionOption = ({
  isLoading,
  setLoading,
  isDashboardTable = false,
  promotionStatus,
  loan,
  promotion,
  isAdmin,
}) => (promotionOption, index, arr) => {
  const {
    _collection,
    _id: promotionOptionId,
    promotionLots,
    loan: promotionOptionLoan,
    status,
  } = promotionOption;
  const promotionLot = (promotionLots?.length && promotionLots[0]) || {};
  const { name, value } = promotionLot;

  const promotionLotValue = getPromotionLotValue(promotionLot);
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
      !isDashboardTable && {
        raw: status,
        label: <StatusLabel status={status} collection={_collection} />,
      },
      {
        raw: value,
        label:
          typeof promotionLotValue === 'number'
            ? toMoney(promotionLotValue)
            : promotionLotValue,
      },
      !isAdmin && !isDashboardTable && (
        <RequestReservation
          key="reservation"
          promotionOption={promotionOption}
          promotionLotName={name}
          status={status}
        />
      ),
      !!isAdmin && (
        <PromotionLotReservation
          loan={loan || promotionOptionLoan}
          promotion={promotion}
          promotionOption={promotionOption}
        />
      ),
    ].filter(x => x !== false),
  };
};

const sortByPriority = ({ priorityOrder: A }, { priorityOrder: B }) => A - B;

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
    !isDashboardTable && { id: 'status' },
    { id: 'totalValue', style: { whiteSpace: 'nowrap' } },
    !isAdmin && !isDashboardTable && { id: 'requestReservation' },
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
      ...(isDashboardTable &&
        id !== 'priorityOrder' && { style: { width: '30%' }, padding: 'none' }),
    }));

export default mapProps(
  ({
    promotion,
    loan,
    isDashboardTable,
    isAdmin,
    className,
    promotionOptions = loan.promotionOptions,
    ...rest
  }) => {
    const [isLoading, setLoading] = useState(false);

    return {
      rows: promotionOptions.sort(sortByPriority).map(
        makeMapPromotionOption({
          isLoading,
          setLoading,
          isDashboardTable,
          promotionStatus: promotion.status,
          isAdmin,
          loan,
          promotion,
        }),
      ),
      columnOptions: columnOptions({
        isDashboardTable,
        promotionStatus: promotion.status,
        isAdmin,
      }),
      isDashboardTable,
      className,
      promotionOptions,
      promotion,
      loan,
      isLoading,
      setLoading,
      ...rest,
    };
  },
);
