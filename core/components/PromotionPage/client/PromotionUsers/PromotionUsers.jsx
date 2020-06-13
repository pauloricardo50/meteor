import React from 'react';

import Table from '../../../Table';
import T from '../../../Translation';
import PromotionUsersContainer from './PromotionUsersContainer';

const PromotionUsers = ({ rows, columnOptions }) => (
  <div className="animated fadeIn mt-16">
    <div className="card1 card-top promotion-users-table">
      <div
        className="flex center-align"
        style={{ justifyContent: 'space-between' }}
      >
        <h2>
          <T id="PromotionPage.PromotionUsers" />
        </h2>
      </div>
      <Table rows={rows} columnOptions={columnOptions} />
    </div>
  </div>
);

export default PromotionUsersContainer(PromotionUsers);
