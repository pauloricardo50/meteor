// @flow
import React from 'react';

import Table from 'core/components/Table';
import withHider from 'core/containers/withHider';
import T from 'core/components/Translation';
import PromotionProUserAdder from '../PromotionProUserAdder';
import PromotionUsersTableContainer from './PromotionUsersTableContainer';

type PromotionUsersTableProps = {
  promotion: Object,
  rows: Array<Object>,
  columnOptions: Array<Object>,
};

const HiddenUsers = withHider(hide => ({
  label: hide ? 'Afficher les utilisateurs' : 'Masquer les utilisateurs',
  primary: true,
  style: { display: 'block', margin: '0 auto' },
}))(Table);

const PromotionUsersTable = ({
  promotion,
  rows,
  columnOptions,
}: PromotionUsersTableProps) => (
  <div className="card1 card-top promotion-users-table">
    <div className="flex">
      <h2>
        <T id="AdminPromotionPage.PromotionUsers" />
      </h2>
      <PromotionProUserAdder promotion={promotion} />
    </div>
    <HiddenUsers rows={rows} columnOptions={columnOptions} />
  </div>
);

export default PromotionUsersTableContainer(PromotionUsersTable);
