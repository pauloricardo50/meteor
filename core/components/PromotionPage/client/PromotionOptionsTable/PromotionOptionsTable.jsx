//
import React, { useState } from 'react';
import omit from 'lodash/omit';

import { PROMOTION_OPTION_STATUS } from 'core/api/constants';
import MongoSelect from 'core/components/Select/MongoSelect';
import T from 'core/components/Translation';
import TableWithModal from 'core/components/Table/TableWithModal';
import PromotionOptionsTableContainer from './PromotionOptionsTableContainer';
import PromotionReservationDetail from '../PromotionReservations/PromotionReservationDetail/PromotionReservationDetail';

const PromotionOptionsTableComponent = PromotionOptionsTableContainer(
  ({ rows, columnOptions }) => (
    <TableWithModal
      rows={rows}
      columnOptions={columnOptions}
      modalType="dialog"
      getModalProps={({ row: { promotionOption } }) => {
        const { promotionLots, loan } = promotionOption;
        const [promotionLot] = promotionLots;
        return {
          title: (
            <T
              id="PromotionReservationsTable.modalTitle"
              values={{
                lotName: <b>{promotionLot.name}</b>,
                customerName: <b>{loan.user.name}</b>,
              }}
            />
          ),
          children: (
            <PromotionReservationDetail
              promotionOption={promotionOption}
              loan={loan}
            />
          ),
        };
      }}
    />
  ),
);

const PromotionOptionsTable = ({ promotion }) => {
  const [status, setStatus] = useState({
    $in: [
      PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
      PROMOTION_OPTION_STATUS.RESERVATION_WAITLIST,
      PROMOTION_OPTION_STATUS.RESERVED,
      PROMOTION_OPTION_STATUS.SOLD,
    ],
  });

  return (
    <div className="card1 card-top">
      <div className="flex center-align">
        <h3 className="text-center mr-8">Réservations</h3>
        <MongoSelect
          value={status}
          onChange={setStatus}
          options={omit(
            PROMOTION_OPTION_STATUS,
            PROMOTION_OPTION_STATUS.INTERESTED,
          )}
          id="status"
          label="Statut"
        />
      </div>

      <PromotionOptionsTableComponent status={status} promotion={promotion} />
    </div>
  );
};

export default PromotionOptionsTable;
