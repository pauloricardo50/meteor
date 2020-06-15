import React, { useState } from 'react';

import { PROMOTION_OPTIONS_COLLECTION } from '../../../../api/promotionOptions/promotionOptionConstants';
import TableWithModal from '../../../DataTable/Table/TableWithModal';
import StatusLabel from '../../../StatusLabel';
import T, { Money } from '../../../Translation';
import PromotionLotReservation from '../PromotionLotDetail/PromotionLotLoansTable/PromotionLotReservation/PromotionLotReservation';
import { getPromotionLotValue } from '../PromotionManagement/helpers';
import PrioritySetter from './PrioritySetter';
import PromotionOptionDialog from './PromotionOptionDialog';
import RequestReservation from './RequestReservation';

const UserPromotionOptionsTable = ({
  loan,
  isDashboardTable,
  isAdmin,
  className,
  promotionOptions = loan.promotionOptions,
}) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <>
      <h3>
        <T id="collections.promotionOptions" />
      </h3>

      <TableWithModal
        className={className}
        initialSort={{ id: 'priorityOrder', desc: false }}
        columns={[
          {
            accessor: 'priorityOrder',
            Header: isDashboardTable ? (
              '#'
            ) : (
              <T id="PromotionPage.lots.priorityOrder" />
            ),
            disableSortBy: true,
            Cell: ({
              value: priorityOrder,
              row: {
                original: { _id: promotionOptionId },
              },
            }) => (
              <PrioritySetter
                priorityOrder={priorityOrder}
                length={promotionOptions.length}
                promotionOptionId={promotionOptionId}
                isLoading={isLoading}
                setLoading={setLoading}
                allowChange={!isDashboardTable}
              />
            ),
          },
          {
            accessor: 'name',
            Header: <T id="PromotionPage.lots.name" />,
            disableSortBy: true,
          },
          !isDashboardTable && {
            accessor: 'status',
            Header: <T id="PromotionPage.lots.status" />,
            Cell: ({ value }) => (
              <StatusLabel
                status={value}
                collection={PROMOTION_OPTIONS_COLLECTION}
              />
            ),
            disableSortBy: true,
          },
          {
            accessor: 'totalValue',
            Header: <T id="PromotionPage.lots.totalValue" />,
            Cell: ({
              row: {
                original: { promotionLots },
              },
            }) => <Money value={getPromotionLotValue(promotionLots[0])} />,
            disableSortBy: true,
          },
          !isAdmin &&
            !isDashboardTable && {
              accessor: 'requestReservation',
              Header: <T id="PromotionPage.lots.requestReservation" />,
              Cell: ({ row: { original: promotionOption } }) => (
                <RequestReservation promotionOption={promotionOption} />
              ),
              disableSortBy: true,
            },
          !!isAdmin && {
            accessor: 'reservation',
            Header: <T id="PromotionPage.lots.reservation" />,
            disableSortBy: true,
            Cell: ({ row: { original: promotionOption } }) => (
              <PromotionLotReservation
                loan={loan}
                promotionOption={promotionOption}
              />
            ),
          },
        ].filter(x => x)}
        data={promotionOptions}
        modalType="dialog"
        getModalProps={promotionOption => {
          const { name } = promotionOption;

          return {
            title: (
              <div className="modal-promotion-lot-title">
                <span>Lot {name}</span>
              </div>
            ),
            children: (
              <PromotionOptionDialog promotionOption={promotionOption} />
            ),
          };
        }}
      />
    </>
  );
};

export default UserPromotionOptionsTable;
