import { Meteor } from 'meteor/meteor';

import React from 'react';
import cx from 'classnames';

import { PROMOTION_LOT_STATUS } from '../../../../api/promotionLots/promotionLotConstants';
import DataTable from '../../../DataTable';
import MongoSelect from '../../../Select/MongoSelect';
import T from '../../../Translation';
import PromotionLotDetail from '../PromotionLotDetail';
import AppPromotionLotsTableContainer from './AppPromotionLotsTableContainer';
import ProPromotionLotsTableContainer from './ProPromotionLotsTableContainer';

// This modal is only needed in full width when displaying the PromotionLotLoansTable
const isApp = Meteor.microservice === 'app';

const getModalProps = promotionLot => ({
  fullWidth: !isApp,
  maxWidth: false,
  title: <div>Lot {promotionLot?.name}</div>,
  children: <PromotionLotDetail promotionLot={promotionLot} />,
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
  const { promotionLotGroups = [] } = promotion;

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
