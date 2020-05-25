import React, { useContext } from 'react';
import cx from 'classnames';

import { PROMOTION_LOT_STATUS } from '../../../../api/promotionLots/promotionLotConstants';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import MongoSelect from '../../../Select/MongoSelect';
import TableWithModal from '../../../Table/TableWithModal';
import T from '../../../Translation';
import PromotionLotDetail from '../PromotionLotDetail';
import PromotionMetadataContext from '../PromotionMetadata';
import LotDocumentsManager from './LotDocumentsManager';
import PromotionLotModifier from './PromotionLotModifier';
import {
  AppPromotionLotsTableContainer,
  ProPromotionLotsTableContainer,
} from './PromotionLotsTableContainer';

const PromotionLotsTable = ({
  rows,
  columnOptions,
  status,
  setStatus,
  promotionLots,
  promotion,
  className,
  ...props
}) => {
  const currentUser = useCurrentUser();
  const {
    permissions: { canModifyLots, canManageDocuments },
  } = useContext(PromotionMetadataContext);
  return (
    <div className={cx('promotion-lots-table', className)}>
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

      <TableWithModal
        modalType="dialog"
        getModalProps={({ row: { promotionLot } }) => ({
          fullWidth: true,
          maxWidth: false,
          title: (
            <div className="modal-promotion-lot-title">
              <span>Lot {promotionLot && promotionLot.name}</span>
              <div>
                {canModifyLots && (
                  <PromotionLotModifier
                    className="mr-8"
                    promotionLot={promotionLot}
                  />
                )}
                {canManageDocuments && (
                  <LotDocumentsManager
                    documents={promotionLot && promotionLot.documents}
                    property={promotionLot && promotionLot.properties[0]}
                    currentUser={currentUser}
                  />
                )}
              </div>
            </div>
          ),
          children: (
            <PromotionLotDetail
              promotionLot={promotionLot}
              promotion={promotion}
            />
          ),
        })}
        rows={rows}
        columnOptions={columnOptions}
        {...props}
      />
    </div>
  );
};

export const ProPromotionLotsTable = ProPromotionLotsTableContainer(
  PromotionLotsTable,
);
export const AppPromotionLotsTable = AppPromotionLotsTableContainer(
  PromotionLotsTable,
);
