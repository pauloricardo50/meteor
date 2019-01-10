// @flow
import React from 'react';

import PromotionLotPage from 'core/components/PromotionLotPage';
import { isAllowedToModifyPromotion } from 'core/api/security/clientSecurityHelpers';
import ProPromotionLotPageContainer from './ProPromotionLotPageContainer';

type ProPromotionLotPageProps = {};

const ProPromotionLotPage = (props: ProPromotionLotPageProps) => (
  <PromotionLotPage
    {...props}
    canModify={isAllowedToModifyPromotion(props.promotionLot.promotion)}
  />
);

export default ProPromotionLotPageContainer(ProPromotionLotPage);
