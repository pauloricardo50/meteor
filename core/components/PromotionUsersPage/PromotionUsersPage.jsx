// @flow
import React from 'react';

import T from '../Translation';
import PromotionUsersTable from './PromotionUsersTable';

type PromotionUsersPageProps = {};

const PromotionUsersPage = (props: PromotionUsersPageProps) => {
  console.log('loans', props.loans);

  return (
    <div className="promotion-users-page card1">
      <h1>
        <T id="PromotionUsersPage.title" />
      </h1>
      <PromotionUsersTable {...props} />
    </div>
  );
};

export default PromotionUsersPage;
