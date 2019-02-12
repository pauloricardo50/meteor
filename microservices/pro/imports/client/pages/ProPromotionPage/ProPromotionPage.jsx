// @flow
import React from 'react';

import PromotionPage from 'core/components/PromotionPage/client';
import {
  isAllowedToModifyPromotion,
  isAllowedToInviteCustomersToPromotion,
  isAllowedToManagePromotionDocuments,
} from 'core/api/security/clientSecurityHelpers';
import ProPromotionPageContainer from './ProPromotionPageContainer';

type ProPromotionPageProps = {};

const ProPromotionPage = (props: ProPromotionPageProps) => (
  <PromotionPage
    {...props}
    // isPro
  />
);
export default ProPromotionPageContainer(ProPromotionPage);
