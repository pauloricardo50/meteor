// @flow
import React from 'react';

import T from '../../../Translation';
import Table from '../../../Table';
import UserPromotionOptionsTableContainer from './UserPromotionOptionsTableContainer';

type UserPromotionOptionsTableProps = {};

const UserPromotionOptionsTable = ({
  rows,
  columnOptions,
}: UserPromotionOptionsTableProps) => (
  <>
    <h3 className="text-center">
      <T id="collections.promotionOptions" />
    </h3>
    <Table rows={rows} columnOptions={columnOptions} />
  </>
);

export default UserPromotionOptionsTableContainer(UserPromotionOptionsTable);
