// @flow
import React from 'react';

import PromotionPage from 'core/components/PromotionPage/client';
import ProPromotionPageContainer from './ProPromotionPageContainer';

type ProPromotionPageProps = {};

const ProPromotionPage = ({
  promotion,
  currentUser,
}: ProPromotionPageProps) => (
  <PromotionPage
    promotion={promotion}
    currentUser={currentUser}
    canModify
    isPro
  />
);

export default ProPromotionPageContainer(ProPromotionPage);
