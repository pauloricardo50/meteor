// @flow
import React from 'react';

import { PROMOTION_RESERVATION_STATUS } from 'core/api/constants';
import TableWithModal from '../../../Table/TableWithModal';
import T from '../../../Translation';
import Button from '../../../Button';
import MongoSelect from '../../../Select/MongoSelect';
import PromotionReservationsTableContainer from './PromotionReservationsTableContainer';
import PromotionReservationDetail from './PromotionReservationDetail/PromotionReservationDetail';

type PromotionReservationsTableProps = {};

const PromotionReservationsTable = ({
  rows,
  columnOptions,
  status,
  setStatus,
  promotionReservations,
  className,
}: PromotionReservationsTableProps) => (
  <div className={className}>
    <div className="flex center-align">
      <h3 className="text-center mr-8">
        <T id="collections.promotionReservations" />
      </h3>
      <MongoSelect
        value={status}
        onChange={setStatus}
        options={PROMOTION_RESERVATION_STATUS}
        id="status"
        label={<T id="Forms.status" />}
      />
    </div>
    <TableWithModal
      rows={rows}
      columnOptions={columnOptions}
      modalType="dialog"
      modalProps={{}}
      getModalProps={({ row: { data }, setOpen }) => ({
        title: (
          <T
            id="PromotionReservationsTable.modalTitle"
            values={{
              lotName: <b>{data.promotionLot.name}</b>,
              customerName: <b>{data.loan.user.name}</b>,
            }}
          />
        ),
        children: <PromotionReservationDetail promotionReservation={data} />,
        actions: (
          <Button onClick={() => setOpen(false)}>
            <T id="general.close" />
          </Button>
        ),
      })}
    />
  </div>
);

export default PromotionReservationsTableContainer(PromotionReservationsTable);
