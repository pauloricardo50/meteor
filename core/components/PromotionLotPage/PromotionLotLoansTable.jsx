// @flow
import React from 'react';

import Table from 'core/components/Table';
import T from 'core/components/Translation';
import PromotionLotLoansTableContainer from './PromotionLotLoansTableContainer';

type PromotionLotLoansTableProps = {};

const PromotionLotLoansTable = ({
  rows,
  columnOptions,
  isAdmin,
}: PromotionLotLoansTableProps) => (
  <>
    <h3 className="text-center promotion-lot-loans-table-title">
      <T id="PromotionLotLoansTable.title" />
    </h3>
    <Table
      rows={rows}
      columnOptions={columnOptions}
      initialOrderBy={1} // By date
    />
  </>
);

export default PromotionLotLoansTableContainer(PromotionLotLoansTable);
