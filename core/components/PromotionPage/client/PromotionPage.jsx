import React from 'react';
import { Helmet } from 'react-helmet';

import T from '../../Translation';
import PromotionPageContent from './PromotionPageContent';
import { usePromotion } from './PromotionPageContext';
import PromotionPageHeader from './PromotionPageHeader';
import PromotionPageTabs from './PromotionPageTabs';

const shouldDisplayFilesTab = documents =>
  documents?.promotionDocuments?.length;

const getTabs = ({
  permissions: { canSeeCustomers, canSeeUsers, canSeeManagement },
  promotion: { users = [], loanCount, documents },
}) =>
  [
    { id: 'management', shouldDisplay: canSeeManagement },
    { id: 'overview', shouldDisplay: true },
    { id: 'description', shouldDisplay: true },
    { id: 'partners', shouldDisplay: true },
    {
      id: 'files',
      shouldDisplay: shouldDisplayFilesTab(documents),
    },
    {
      id: 'customers',
      label: (
        <T id="PromotionPageTabs.customers" values={{ count: loanCount }} />
      ),
      shouldDisplay: canSeeCustomers,
    },
    {
      id: 'users',
      label: (
        <T id="PromotionPageTabs.users" values={{ count: users.length }} />
      ),
      shouldDisplay: canSeeUsers,
    },
  ]
    .filter(({ shouldDisplay }) => shouldDisplay)
    .map(tab => ({
      ...tab,
      label: tab.label || <T id={`PromotionPageTabs.${tab.id}`} />,
    }));

const PromotionPage = ({ promotion, route, ctaTop, ctaBottom, ...props }) => {
  const { name } = promotion;
  const { permissions } = usePromotion();
  const tabs = getTabs({ permissions, promotion });

  return (
    <div className="promotion-page">
      <Helmet>
        <title>{name}</title>
      </Helmet>
      {ctaTop}
      <PromotionPageHeader promotion={promotion} />
      <PromotionPageTabs promotion={promotion} route={route} tabs={tabs} />
      <PromotionPageContent
        promotion={promotion}
        route={route}
        tabs={tabs}
        {...props}
      />
      {ctaBottom}
    </div>
  );
};

export default PromotionPage;
