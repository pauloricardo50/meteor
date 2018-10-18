// @flow
import React from 'react';
import Table from 'core/components/Table';
import T from 'core/components/Translation';
import PromotionProUserAdder from '../PromotionProUserAdder';
import PromotionUsersTableContainer from './PromotionUsersTableContainer';

type PromotionUsersTableProps = {
  promotion: Object,
  rows: Array<Object>,
  columnOptions: Array<Object>,
};

const PromotionUsersTable = ({
  promotion,
  rows,
  columnOptions,
}: PromotionUsersTableProps) => (
  <div className="card1 promotion-users-table">
    <PromotionProUserAdder promotion={promotion} />
    <h1>
      <T id="AdminPromotionPage.PromotionUsers" />
    </h1>
    <Table rows={rows} columnOptions={columnOptions} />
  </div>
);

export default PromotionUsersTableContainer(PromotionUsersTable);
