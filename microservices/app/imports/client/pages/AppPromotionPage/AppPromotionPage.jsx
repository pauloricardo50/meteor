// @flow
import React from 'react';

import PromotionPage from 'core/components/PromotionPage/client';
import AppPromotionPageContainer from './AppPromotionPageContainer';

type AppPromotionPageProps = {};

const AppPromotionPage = ({
  promotion,
  currentUser,
  loan,
}: AppPromotionPageProps) => {
  console.log('promotion', promotion);

  return (
    <PromotionPage
      promotion={promotion}
      currentUser={currentUser}
      loan={loan}
    />
  );
};

export default AppPromotionPageContainer(AppPromotionPage);
