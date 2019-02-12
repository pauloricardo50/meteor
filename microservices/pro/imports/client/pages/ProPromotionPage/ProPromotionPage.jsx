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

const ProPromotionPage = ({
  promotion,
  currentUser,
}: ProPromotionPageProps) => (
  <PromotionPage
    promotion={promotion}
    currentUser={currentUser}
    canModifyPromotion={isAllowedToModifyPromotion({ promotion, currentUser })}
    canInviteCustomers={isAllowedToInviteCustomersToPromotion({
      promotion,
      currentUser,
    })}
    canManageDocuments={isAllowedToManagePromotionDocuments({
      promotion,
      currentUser,
    })}
    // isPro
  />
);
export default ProPromotionPageContainer(ProPromotionPage);
