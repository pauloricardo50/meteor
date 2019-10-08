// @flow
import React, { useEffect, useState } from 'react';
import cx from 'classnames';

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
  className,
  ...props
}: PromotionLotsTableProps) => {
  const [modalPromotionLot, setModalPromotionLot] = useState();
  useEffect(() => {
    if (promotionLotModal) {
      setModalPromotionLot(promotionLots.find(({ _id }) => _id === promotionLotModal));
    }
  });

  return (
    <div className={cx('promotion-lots-table', className)}>
      <PromotionLotsTableDialog
        open={!!promotionLotModal}
        promotionLot={modalPromotionLot}
        promotion={promotion}
        handleClose={() => setPromotionLotModal()}
      />

      <div className="flex center-align">
        <h3 className="text-center mr-8">
          <T id="collections.lots" />
        </h3>
        <MongoSelect
          value={status}
          onChange={setStatus}
          options={PROMOTION_LOT_STATUS}
          id="status"
          label="Statut"
        />
      </div>

      <Table rows={rows} columnOptions={columnOptions} {...props} />
    </div>
  );
};

export const ProPromotionLotsTable = ProPromotionLotsTableContainer(PromotionLotsTable);
export const AppPromotionLotsTable = AppPromotionLotsTableContainer(PromotionLotsTable);
