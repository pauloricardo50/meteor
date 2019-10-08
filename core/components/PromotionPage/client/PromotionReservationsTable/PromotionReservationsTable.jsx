// @flow
import React from 'react';

import { PROMOTION_RESERVATION_STATUS } from 'core/api/constants';
import Table from '../../../Table';
import T from '../../../Translation';
import MongoSelect from '../../../Select/MongoSelect';
import PromotionReservationsTableContainer from './PromotionReservationsTableContainer';

type PromotionReservationsTableProps = {};

const PromotionReservationsTable = ({
  rows,
  columnOptions,
  status,
  setStatus,
}: PromotionReservationsTableProps) => (
  <div className="card1 card-top">
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
    <Table rows={rows} columnOptions={columnOptions} />
  </div>
);

export default PromotionReservationsTableContainer(PromotionReservationsTable);
