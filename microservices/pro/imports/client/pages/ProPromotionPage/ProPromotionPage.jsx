// @flow
import React from 'react';

import PromotionPage from 'core/components/PromotionPage/client';
import { isAllowedToModifyPromotion } from 'core/api/security/clientSecurityHelpers';
import ProPromotionPageContainer from './ProPromotionPageContainer';

type ProPromotionPageProps = {};

const ProPromotionPage = ({
  promotion,
  currentUser,
}: ProPromotionPageProps) => (
  <PromotionPage
    promotion={promotion}
    currentUser={currentUser}
    canModify={isAllowedToModifyPromotion(promotion)}
    isPro
  />
);
export default ProPromotionPageContainer(ProPromotionPage);
