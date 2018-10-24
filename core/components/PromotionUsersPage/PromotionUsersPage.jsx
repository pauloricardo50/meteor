// @flow
import React from 'react';

import T from '../Translation';
import PromotionUsersTable from './PromotionUsersTable';

type PromotionUsersPageProps = {};

const PromotionUsersPage = ({ loans }: PromotionUsersPageProps) => {
  console.log('loans', loans);

  return (
    <div className="promotion-users-page card1">
      <h1>
        <T id="PromotionUsersPage.title" />
      </h1>
      <PromotionUsersTable loans={loans} />
    </div>
  );
};

export default PromotionUsersPage;
