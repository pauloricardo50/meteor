// @flow
import React from 'react';

import PromotionPage from 'core/components/PromotionPage/client';
import AppPromotionPageContainer from './AppPromotionPageContainer';

type AppPromotionPageProps = {};

const AppPromotionPage = ({
  promotion,
  currentUser,
}: AppPromotionPageProps) => {
  console.log('promotion', promotion);

  return <PromotionPage promotion={promotion} currentUser={currentUser} />;
};

export default AppPromotionPageContainer(AppPromotionPage);
