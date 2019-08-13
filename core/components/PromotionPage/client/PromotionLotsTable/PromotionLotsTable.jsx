// @flow
import React from 'react';

import { PROMOTION_LOT_STATUS } from '../../../../api/constants';
import T from '../../../Translation';
import Table from '../../../Table';
import MongoSelect from '../../../Select/MongoSelect';
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
}: PromotionLotsTableProps) => (
  <>
    <h3 className="text-center">
      <T id="collections.lots" />
    </h3>
    <MongoSelect
      value={status}
      onChange={setStatus}
      options={PROMOTION_LOT_STATUS}
      id="status"
      label="Statut"
    />
    <Table rows={rows} columnOptions={columnOptions} />
  </>
);

export const ProPromotionLotsTable = ProPromotionLotsTableContainer(PromotionLotsTable);
export const AppPromotionLotsTable = AppPromotionLotsTableContainer(PromotionLotsTable);
