// @flow
import React, { useContext } from 'react';

import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import T from 'core/components/Translation';
import { ProPropertyAdder } from 'core/components/ProPropertyPage/ProPropertyForm';
import ProCustomerAdder from 'core/components/ProCustomersTable/ProCustomerAdder';
import PromotionAdder from './PromotionAdder';
import ExternalPropertyAdder from './ExternalPropertyAdder';
import ProDashboardPageTabs from './ProDashboardPageTabs';

type ProDashboardPageProps = {};

const ProDashboardPage = (props: ProDashboardPageProps) => {
  const currentUser = useContext(CurrentUserContext);

  return (
    <div className="card1 pro-dashboard-page">
      <h1>
        <T id="ProDashboardPage.title" />
      </h1>
      <div className="buttons">
        <PromotionAdder currentUser={currentUser} />
        <ProPropertyAdder currentUser={currentUser} />
        {currentUser.apiPublicKey && <ExternalPropertyAdder />}
        <ProCustomerAdder currentUser={currentUser} />
      </div>
      <ProDashboardPageTabs currentUser={currentUser} />
    </div>
  );
};

export default ProDashboardPage;
