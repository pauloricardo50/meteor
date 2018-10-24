// @flow
import React from 'react';

import Table from 'core/components/Table';
import PromotionUsersTableContainer from './PromotionUsersTableContainer';

type PromotionUsersTableProps = {};

const PromotionUsersTable = ({
  rows,
  columnOptions,
}: PromotionUsersTableProps) => (
  <Table rows={rows} columnOptions={columnOptions} clickable={false} />
);

export default PromotionUsersTableContainer(PromotionUsersTable);
