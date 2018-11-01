// @flow
import React from 'react';

import PromotionLotPage from 'core/components/PromotionLotPage';
import PromotionSecurity from 'core/api/security/collections/PromotionSecurity';
import ProPromotionLotPageContainer from './ProPromotionLotPageContainer';

type ProPromotionLotPageProps = {};

const ProPromotionLotPage = (props: ProPromotionLotPageProps) => (
  <PromotionLotPage
    {...props}
    canModify={PromotionSecurity.isAllowedToModify(props.promotionLot.promotion)}
  />
);

export default ProPromotionLotPageContainer(ProPromotionLotPage);
