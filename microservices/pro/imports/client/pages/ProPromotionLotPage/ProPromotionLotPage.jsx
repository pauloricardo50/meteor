// @flow
import React from 'react';

import PromotionLotPage from 'core/components/PromotionLotPage';
import ProPromotionLotPageContainer from './ProPromotionLotPageContainer';

type ProPromotionLotPageProps = {};

const ProPromotionLotPage = (props: ProPromotionLotPageProps) => <PromotionLotPage {...props} />;

export default ProPromotionLotPageContainer(ProPromotionLotPage);
