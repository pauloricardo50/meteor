// @flow
import React from 'react';

import PromotionPageTabs from './PromotionPageTabs';

type PromotionPageProps = {};

const PromotionPage = ({ promotion }: PromotionPageProps) => (
  <div className="promotion-page">
    <PromotionPageTabs promotion={promotion} />
  </div>
);

export default PromotionPage;
