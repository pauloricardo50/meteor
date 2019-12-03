// @flow
import React from 'react';

import Table from '../../../Table';
import PromotionCustomersTableContainer from './PromotionCustomersTableContainer';

type PromotionUsersTableProps = {};

const PromotionCustomersTable = ({
  rows,
  columnOptions,
}: PromotionUsersTableProps) => (
  <Table
    rows={rows}
    columnOptions={columnOptions}
    className="promotion-users-table"
  />
);

export default PromotionCustomersTableContainer(PromotionCustomersTable);
