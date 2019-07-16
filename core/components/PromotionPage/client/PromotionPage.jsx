// @flow
import React from 'react';
import { Helmet } from 'react-helmet';

import PromotionPageTabs from './PromotionPageTabs';
import PromotionPageHeader from './PromotionPageHeader';
import PromotionPageContent from './PromotionPageContent';
import PromotionLotsTable from './PromotionLotsTable';
import LotsTable from './LotsTable';

type PromotionPageProps = {};

const PromotionPage = ({ promotion }: PromotionPageProps) => {
  const { name } = promotion;

  return (
    <div className="promotion-page">
      <Helmet>
        <title>{name}</title>
      </Helmet>
      <PromotionPageTabs promotion={promotion} />
      <PromotionPageHeader promotion={promotion} />
      <PromotionPageContent promotion={promotion} />
      <PromotionLotsTable promotion={promotion} />
      <LotsTable promotion={promotion} />
    </div>
  );
};

export default PromotionPage;
