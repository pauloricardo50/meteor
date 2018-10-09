// @flow
import React from 'react';

import PromotionPage from 'core/components/PromotionPage/client';
import ProPromotionPageContainer from './ProPromotionPageContainer';

type ProPromotionPageProps = {};

const ProPromotionPage = ({ promotion }: ProPromotionPageProps) => (
  <PromotionPage promotion={promotion} canModify isPro />
);

export default ProPromotionPageContainer(ProPromotionPage);
