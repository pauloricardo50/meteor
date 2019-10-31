// @flow
import React, { useContext } from 'react';

import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import { withSmartQuery } from '../../../../api';
import { proPromotionLoans } from '../../../../api/loans/queries';
import T from '../../../Translation';
import PromotionCustomersTable from './PromotionCustomersTable';

type PromotionCustomersProps = {};

const PromotionCustomers = (props: PromotionCustomersProps) => {
  const currentUser = useContext(CurrentUserContext);

  return (
    <div className="animated fadeIn">
      <h2>
        <T id="PromotionUsersPage.title" />
      </h2>
      <div className="card1 card-top">
        <PromotionCustomersTable {...props} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default withSmartQuery({
  query: proPromotionLoans,
  params: ({ promotion: { _id: promotionId } }) => ({ promotionId }),
  queryOptions: { reactive: false },
  dataName: 'loans',
})(PromotionCustomers);
