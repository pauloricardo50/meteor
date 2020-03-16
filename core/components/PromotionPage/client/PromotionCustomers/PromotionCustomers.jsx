import React, { useContext } from 'react';
import { withState, compose } from 'recompose';

import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import { LOAN_STATUS } from '../../../../api/constants';
import { withSmartQuery } from '../../../../api/containerToolkit';
import { proPromotionLoans } from '../../../../api/loans/queries';
import T from '../../../Translation';
import PromotionCustomersTable from './PromotionCustomersTable';

const PromotionCustomers = props => {
  const currentUser = useContext(CurrentUserContext);
  const { loans = [] } = props;

  return (
    <div className="animated fadeIn mt-16">
      <div className="card1 card-top">
        <h2>
          <T id="PromotionUsersPage.title" />
          &nbsp;
          <small className="secondary">{`${loans.length} clients`}</small>
        </h2>
        <PromotionCustomersTable {...props} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default compose(
  withState('status', 'setStatus', {
    $in: Object.values(LOAN_STATUS).filter(
      s => s !== LOAN_STATUS.UNSUCCESSFUL && s !== LOAN_STATUS.TEST,
    ),
  }),
  withSmartQuery({
    query: proPromotionLoans,
    params: ({ promotion: { _id: promotionId }, status }) => ({
      promotionId,
      status,
    }),
    queryOptions: { reactive: false },
    dataName: 'loans',
  }),
)(PromotionCustomers);
