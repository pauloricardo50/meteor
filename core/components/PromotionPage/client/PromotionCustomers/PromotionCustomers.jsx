import React from 'react';

import T from '../../../Translation';
import PromotionCustomersTable from './PromotionCustomersTable';

const PromotionCustomers = props => (
  <div className="animated fadeIn mt-16">
    <div className="card1 card-top">
      <h2>
        <T id="PromotionUsersPage.title" />
      </h2>
      <PromotionCustomersTable {...props} />
    </div>
  </div>
);

export default PromotionCustomers;
