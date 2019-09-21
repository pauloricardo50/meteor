// @flow
import React from 'react';

import Table from '../../../Table';
import T from '../../../Translation';
import PromotionProUserAdder from './PromotionProUserAdder';
import PromotionUsersContainer from './PromotionUsersContainer';

type PromotionUsersProps = {
  promotion: Object,
  rows: Array<Object>,
  columnOptions: Array<Object>,
};

const PromotionUsers = ({
  promotion,
  rows,
  columnOptions,
}: PromotionUsersProps) => (
  <div className="animated fadeIn">
    <div className="flex center-align">
      <h2 style={{ marginRight: 16 }}>
        <T id="AdminPromotionPage.PromotionUsers" />
      </h2>
      <PromotionProUserAdder promotion={promotion} />
    </div>
    <div className="card1 card-top promotion-users-table">
      <Table rows={rows} columnOptions={columnOptions} />
    </div>
  </div>
);

export default PromotionUsersContainer(PromotionUsers);
