// @flow
import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import { NEW_PROMOTION_PAGE } from 'imports/startup/client/proRoutes';
import PromotionsTable from './PromotionsTable';

type ProDashboardPageProps = {};

const ProDashboardPage = ({ currentUser }: ProDashboardPageProps) => (
  <div className="card1 pro-dashboard-page">
    <h1>
      <T id="ProDashboardPage.title" />
    </h1>
    <div className="buttons">
      <Button raised primary link to={NEW_PROMOTION_PAGE}>
        <T id="ProDashboardPage.addPromotion" />
      </Button>
    </div>

    <h3 className="text-center">
      <T id="ProDashboardPage.promotions" />
    </h3>
    <PromotionsTable currentUser={currentUser} />
  </div>
);

export default ProDashboardPage;
