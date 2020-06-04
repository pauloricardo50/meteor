import React, { useContext } from 'react';
import cx from 'classnames';

import { PROMOTION_LOT_STATUS } from '../../../../api/promotionLots/promotionLotConstants';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import DataTable from '../../../DataTable';
import MongoSelect from '../../../Select/MongoSelect';
import T from '../../../Translation';
import PromotionLotDetail from '../PromotionLotDetail';
import PromotionMetadataContext from '../PromotionMetadata';
import AppPromotionLotsTableContainer from './AppPromotionLotsTableContainer';
import LotDocumentsManager from './LotDocumentsManager';
import PromotionLotModifier from './PromotionLotModifier';
import ProPromotionLotsTableContainer from './ProPromotionLotsTableContainer';

const makeGetModalProps = ({
  canModifyLots,
  canManageDocuments,
  promotion,
  currentUser,
}) => promotionLot => ({
  fullWidth: true,
  maxWidth: false,
  title: (
    <div className="modal-promotion-lot-title">
      <span>Lot {promotionLot?.name}</span>
      <div>
        {canModifyLots && (
          <PromotionLotModifier
            className="mr-8"
            promotionLot={promotionLot}
            promotion={promotion}
          />
        )}
        {canManageDocuments && (
          <LotDocumentsManager
            documents={promotionLot?.documents}
            property={promotionLot?.properties[0]}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  ),
  children: (
    <PromotionLotDetail promotionLot={promotionLot} promotion={promotion} />
  ),
});

const PromotionLotsTable = ({
  status,
  setStatus,
  promotion,
  className,
  promotionLotGroupId,
  setPromotionLotGroupId,
  queryConfig,
  queryDeps,
  columns,
  initialHiddenColumns,
}) => {
  const currentUser = useCurrentUser();
  const {
    permissions: { canModifyLots, canManageDocuments },
  } = useContext(PromotionMetadataContext);
  const { promotionLotGroups = [] } = promotion;
  const getModalProps = makeGetModalProps({
    canModifyLots,
    canManageDocuments,
    promotion,
    currentUser,
  });

  return (
    <div className={cx('promotion-lots-table', className)}>
      <div className="flex center-align">
        <h3 className="text-center mr-8">
          <T id="collections.lots" />
        </h3>
        {setStatus && (
          <MongoSelect
            value={status}
            onChange={setStatus}
            options={PROMOTION_LOT_STATUS}
            id="status"
            label="Statut"
            className="mr-8"
          />
        )}
        {!!promotionLotGroups.length && (
          <MongoSelect
            value={promotionLotGroupId}
            onChange={setPromotionLotGroupId}
            options={promotionLotGroups}
            id="promotionLotGroupIds"
            label="Groupe de lots"
          />
        )}
      </div>

      <DataTable
        queryConfig={queryConfig}
        queryDeps={queryDeps}
        columns={columns}
        initialPageSize={10}
        modalType="dialog"
        getModalProps={getModalProps}
        initialHiddenColumns={initialHiddenColumns}
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
