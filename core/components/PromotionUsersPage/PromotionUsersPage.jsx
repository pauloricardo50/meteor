// @flow
import React from 'react';

import T from '../Translation';
import PromotionUsersTable from './PromotionUsersTable';
import CustomerAdder from '../PromotionPage/client/CustomerAdder';

type PromotionUsersPageProps = {};

const PromotionUsersPage = (props: PromotionUsersPageProps) => {
  const { loans, promotionId } = props;
  console.log('loans', props.loans);

  return (
    <div className="promotion-users-page card1">
      <h1>
        <T id="PromotionUsersPage.title" />
      </h1>
      <CustomerAdder promotionId={promotionId} />
      <PromotionUsersTable {...props} />
    </div>
  );
};

export default PromotionUsersPage;
