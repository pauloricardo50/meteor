// @flow
import React from 'react';

import PromotionPage from 'core/components/PromotionPage/client';
import AppPromotionPageContainer from './AppPromotionPageContainer';

type AppPromotionPageProps = {};

const AppPromotionPage = ({
  promotion,
  currentUser,
  loan,
  invitedByUser,
}: AppPromotionPageProps) => (
  <PromotionPage
    promotion={promotion}
    currentUser={currentUser}
    loan={loan}
    invitedByUser={invitedByUser}
  />
);

export default AppPromotionPageContainer(AppPromotionPage);
