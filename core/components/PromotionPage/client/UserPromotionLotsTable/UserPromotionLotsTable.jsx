// @flow
import React from 'react';

import T from '../../../Translation';
import Table from '../../../Table';
import UserPromotionLotsTableContainer from './UserPromotionLotsTableContainer';

type UserPromotionLotsTableProps = {};

const UserPromotionLotsTable = ({
  rows,
  columnOptions,
}: UserPromotionLotsTableProps) => (
  <>
    <h3 className="text-center">
      <T id="collections.lots" />
    </h3>
    <Table rows={rows} columnOptions={columnOptions} />
  </>
);

export default UserPromotionLotsTableContainer(UserPromotionLotsTable);
