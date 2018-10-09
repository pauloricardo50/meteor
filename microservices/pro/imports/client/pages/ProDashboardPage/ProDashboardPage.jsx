// @flow
import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import {
  NEW_PROMOTION_PAGE,
  NEW_PROPERTY_PAGE,
} from 'imports/startup/client/proRoutes';
import PromotionsTable from './PromotionsTable';

type ProDashboardPageProps = {};

const ProDashboardPage = ({ currentUser }: ProDashboardPageProps) => (
  <div className="card1 pro-dashboard-page">
    <h1>Hello Pro</h1>
    <div className="buttons">
      {/* <Button raised primary link to={NEW_PROPERTY_PAGE}>
        <T id="ProDashboardPage.addProperty" />
      </Button> */}
      <Button raised primary link to={NEW_PROMOTION_PAGE}>
        <T id="ProDashboardPage.addPromotion" />
      </Button>
    </div>

    <PromotionsTable currentUser={currentUser} />
  </div>
);

export default ProDashboardPage;
