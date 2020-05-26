import React from 'react';

import ProCustomerAdder from 'core/components/ProCustomersTable/ProCustomerAdder';
import { ProPropertyAdder } from 'core/components/ProPropertyPage/ProPropertyForm';
import T from 'core/components/Translation';
import useCurrentUser from 'core/hooks/useCurrentUser';

import ExternalPropertyAdder from './ExternalPropertyAdder';
import ProDashboardPageTabs from './ProDashboardPageTabs';
import PromotionAdder from './PromotionAdder';

const ProDashboardPage = props => {
  const currentUser = useCurrentUser();

  return (
    <div className="card1 pro-dashboard-page">
      <h1>
        <T id="ProDashboardPage.title" />
      </h1>
      <div className="buttons">
        <ProCustomerAdder currentUser={currentUser} />
        <PromotionAdder currentUser={currentUser} />
        <ProPropertyAdder currentUser={currentUser} />
        {currentUser.apiPublicKey && <ExternalPropertyAdder />}
      </div>
      <ProDashboardPageTabs currentUser={currentUser} />
    </div>
  );
};

export default ProDashboardPage;
