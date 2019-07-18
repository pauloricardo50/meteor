// @flow
import React from 'react';
import { Helmet } from 'react-helmet';

import PromotionPageTabs from './PromotionPageTabs';
import PromotionPageHeader from './PromotionPageHeader';
import PromotionPageContent from './PromotionPageContent';

type PromotionPageProps = {};

const PromotionPage = ({ promotion }: PromotionPageProps) => {
  const { name } = promotion;

  return (
    <div className="promotion-page">
      <Helmet>
        <title>{name}</title>
      </Helmet>
      <PromotionPageHeader promotion={promotion} />
      <PromotionPageTabs promotion={promotion} />
      <PromotionPageContent promotion={promotion} />
    </div>
  );
};

export default PromotionPage;
