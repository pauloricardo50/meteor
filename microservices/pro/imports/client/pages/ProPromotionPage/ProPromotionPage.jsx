// @flow
import React from 'react';

import PromotionPage from 'core/components/PromotionPage/client';
import { SecurityService } from 'core/api';
import ProPromotionPageContainer from './ProPromotionPageContainer';

type ProPromotionPageProps = {};

const ProPromotionPage = ({
  promotion,
  currentUser,
}: ProPromotionPageProps) => (
  <PromotionPage
    promotion={promotion}
    currentUser={currentUser}
    canModify={SecurityService.canModifyDoc(promotion)}
    isPro
  />
);

export default ProPromotionPageContainer(ProPromotionPage);
