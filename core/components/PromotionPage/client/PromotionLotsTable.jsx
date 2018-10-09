// @flow
import React from 'react';

import Table from '../../Table';
import PromotionLotsTableContainer from './PromotionLotsTableContainer';

type PromotionLotsTableProps = {};

const PromotionLotsTable = ({
  rows,
  columnOptions,
}: PromotionLotsTableProps) => (
  <Table rows={rows} columnOptions={columnOptions} />
);

export default PromotionLotsTableContainer(PromotionLotsTable);
