// @flow
import React from 'react';

import PromotionLotPage from 'core/components/PromotionLotPage';
import SecurityService from 'core/api/security';
import ProPromotionLotPageContainer from './ProPromotionLotPageContainer';

type ProPromotionLotPageProps = {};

const ProPromotionLotPage = (props: ProPromotionLotPageProps) => (
  <PromotionLotPage
    {...props}
    canModify={SecurityService.canModifyDoc(props.promotionLot.promotion)}
  />
);

export default ProPromotionLotPageContainer(ProPromotionLotPage);
