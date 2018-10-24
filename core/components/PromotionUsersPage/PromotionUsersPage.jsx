// @flow
import React from 'react';

import T from '../Translation';

type PromotionUsersPageProps = {};

const PromotionUsersPage = (props: PromotionUsersPageProps) => {
  console.log('loans', props.loans);

  return (
    <div className="promotion-users-page card1">
      <h1>
        <T id="PromotionUsersPage.title" />
      </h1>
    </div>
  );
};

export default PromotionUsersPage;
