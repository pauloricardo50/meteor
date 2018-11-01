// @flow
import React from 'react';

import Table from 'core/components/Table';
import PromotionUsersTableContainer from './PromotionUsersTableContainer';

type PromotionUsersTableProps = {};

const PromotionUsersTable = ({
  rows,
  columnOptions,
  isAdmin,
}: PromotionUsersTableProps) => (
  <Table
    rows={rows}
    columnOptions={columnOptions}
    clickable={!!isAdmin}
    className="promotion-users-table"
  />
);

export default PromotionUsersTableContainer(PromotionUsersTable);
