// @flow
import React from 'react';

import Table from '../../../../Table';
import PromotionLotLoansTableContainer from './PromotionLotLoansTableContainer';

type PromotionLotLoansTableProps = {};

const PromotionLotLoansTable = ({
  rows,
  columnOptions,
  isAdmin,
}: PromotionLotLoansTableProps) => (
  <Table
    rows={rows}
    columnOptions={columnOptions}
    initialOrderBy={1} // By date
    className="promotion-lot-loans-table"
  />
);

export default PromotionLotLoansTableContainer(PromotionLotLoansTable);
