// @flow
import React, { useEffect, useState } from 'react';

import { PROMOTION_LOT_STATUS } from '../../../../api/constants';
import T from '../../../Translation';
import Table from '../../../Table';
import Button from '../../../Button';
import MongoSelect from '../../../Select/MongoSelect';
import Dialog from '../../../Material/Dialog';
import PromotionLotDetail from '../PromotionLotDetail';
import {
  AppPromotionLotsTableContainer,
  ProPromotionLotsTableContainer,
} from './PromotionLotsTableContainer';

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
      setModalPromotionLot(promotionLots.find(({ _id }) => _id === promotionLotModal));
    }
  });

  return (
    <>
      <h3 className="text-center">
        <T id="collections.lots" />
      </h3>

      <Dialog
        open={!!promotionLotModal}
        title={modalPromotionLot && modalPromotionLot.name}
        actions={(
          <Button primary onClick={() => setPromotionLotModal()}>
            <T id="general.close" />
          </Button>
        )}
        maxWidth={false}
        onClose={() => setPromotionLotModal()}
      >
        {modalPromotionLot && (
          <PromotionLotDetail
            promotionLot={modalPromotionLot}
            promotion={promotion}
          />
        )}
      </Dialog>

      <MongoSelect
        value={status}
        onChange={setStatus}
        options={PROMOTION_LOT_STATUS}
        id="status"
        label="Statut"
      />

      <Table rows={rows} columnOptions={columnOptions} {...props} />
    </>
  );
};

export const ProPromotionLotsTable = ProPromotionLotsTableContainer(PromotionLotsTable);
export const AppPromotionLotsTable = AppPromotionLotsTableContainer(PromotionLotsTable);
