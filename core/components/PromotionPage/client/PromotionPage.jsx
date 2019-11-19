// @flow
import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';

import T from '../../Translation';
import PromotionPageTabs from './PromotionPageTabs';
import PromotionPageHeader from './PromotionPageHeader';
import PromotionPageContent from './PromotionPageContent';
import PromotionMetadataContext from './PromotionMetadata';

const getTabs = ({
  permissions: { canSeeCustomers, canSeeUsers, canSeeManagement },
  promotion: { users = [], loans = [], documents },
}) =>
  [
    { id: 'management', shouldDisplay: canSeeManagement },
    { id: 'overview', shouldDisplay: true },
    { id: 'map', shouldDisplay: true },
    { id: 'partners', shouldDisplay: true },
    {
      id: 'files',
      shouldDisplay:
        documents &&
        documents.promotionDocuments &&
        documents.promotionDocuments.length > 0,
    },
    {
      id: 'customers',
      label: (
        <T id="PromotionPageTabs.customers" values={{ count: loans.length }} />
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

type PromotionPageProps = {};

const PromotionPage = ({ promotion, route, ...props }: PromotionPageProps) => {
  const { name } = promotion;
  const { permissions } = useContext(PromotionMetadataContext);
  const tabs = getTabs({ permissions, promotion });

  return (
    <div className="promotion-page">
      <Helmet>
        <title>{name}</title>
      </Helmet>
      <PromotionPageHeader promotion={promotion} />
      <PromotionPageTabs promotion={promotion} route={route} tabs={tabs} />
      <PromotionPageContent
        promotion={promotion}
        route={route}
        tabs={tabs}
        {...props}
      />
    </div>
  );
};

export default PromotionPage;
