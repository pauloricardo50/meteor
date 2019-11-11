// @flow
import React, { useEffect, useState } from 'react';

import { PROMOTION_LOT_STATUS } from '../../../../api/constants';
import T from '../../../Translation';
import Table from '../../../Table';
import MongoSelect from '../../../Select/MongoSelect';

import {
  AppPromotionLotsTableContainer,
  ProPromotionLotsTableContainer,
} from './PromotionLotsTableContainer';
import PromotionLotsTableDialog from './PromotionLotsTableDialog';

type PromotionLotsTableProps = {};

const PromotionLotsTable = ({
  rows,
  columnOptions,
  status,
  setStatus,
  promotionLots,
  promotionLotModal,
  setPromotionLotModal,
  promotion,
  ...props
}: PromotionLotsTableProps) => {
  const [modalPromotionLot, setModalPromotionLot] = useState();
  useEffect(() => {
    if (promotionLotModal) {
      setModalPromotionLot(
        promotionLots.find(({ _id }) => _id === promotionLotModal),
      );
    }
  });

  return (
    <div className="promotion-lots-table" style={{ width: '100%' }}>
      <h3 className="text-center">
        <T id="collections.lots" />
      </h3>

      <PromotionLotsTableDialog
        open={!!promotionLotModal}
        promotionLot={modalPromotionLot}
        promotion={promotion}
        handleClose={() => setPromotionLotModal()}
      />

      <MongoSelect
        value={status}
        onChange={setStatus}
        options={PROMOTION_LOT_STATUS}
        id="status"
        label="Statut"
      />

      <Table rows={rows} columnOptions={columnOptions} {...props} />
    </div>
  );
};

export const ProPromotionLotsTable = ProPromotionLotsTableContainer(
  PromotionLotsTable,
);
export const AppPromotionLotsTable = AppPromotionLotsTableContainer(
  PromotionLotsTable,
);
