// @flow
import React from 'react';

import Table from '../../../Table';
import PromotionCustomersTableContainer from './PromotionCustomersTableContainer';

type PromotionUsersTableProps = {};

const PromotionCustomersTable = ({
  rows,
  columnOptions,
}: PromotionUsersTableProps) => (
  <>
    <h3 className="secondary" style={{ marginTop: 0 }}>
      {rows.length}
      {' '}
clients
    </h3>
    <Table
      rows={rows}
      columnOptions={columnOptions}
      className="promotion-users-table"
    />
  </>
);

export default PromotionCustomersTableContainer(PromotionCustomersTable);
