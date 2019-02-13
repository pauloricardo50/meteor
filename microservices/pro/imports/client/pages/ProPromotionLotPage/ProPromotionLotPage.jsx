// @flow
import React from 'react';

import PromotionLotPage from 'core/components/PromotionLotPage';
import ProPromotionLotPageContainer from './ProPromotionLotPageContainer';

type ProPromotionLotPageProps = {};

const ProPromotionLotPage = (props: ProPromotionLotPageProps) => {
  console.log('props', props);
  return <PromotionLotPage {...props} />;
};

export default ProPromotionLotPageContainer(ProPromotionLotPage);
