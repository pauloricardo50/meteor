// @flow
import React from 'react';

import Table from 'core/components/Table';
import T from 'core/components/Translation';
import PromotionLotLoansTableContainer from './PromotionLotLoansTableContainer';

type PromotionLotLoansTableProps = {};

const PromotionLotLoansTable = ({
  rows,
  columnOptions,
}: PromotionLotLoansTableProps) => (
  <>
    <h3 className="text-center">
      <T id="PromotionLotLoansTable.title" />
    </h3>
    <Table rows={rows} columnOptions={columnOptions} />
  </>
);

export default PromotionLotLoansTableContainer(PromotionLotLoansTable);
