// @flow
import React from 'react';

import { withSmartQuery } from '../../../../api';
import { proPromotionLoans } from '../../../../api/loans/queries';
import T from '../../../Translation';
import PromotionCustomersTable from './PromotionCustomersTable';

type PromotionCustomersProps = {};

const PromotionCustomers = (props: PromotionCustomersProps) => (
  <div className="animated fadeIn">
    <h2>
      <T id="PromotionUsersPage.title" />
    </h2>
    <div className="card1 card-top">
      <PromotionCustomersTable {...props} />
    </div>
  </div>
);

export default withSmartQuery({
  query: proPromotionLoans,
  params: ({ promotion: { _id: promotionId } }) => ({ promotionId }),
  queryOptions: { reactive: false },
  dataName: 'loans',
})(PromotionCustomers);
