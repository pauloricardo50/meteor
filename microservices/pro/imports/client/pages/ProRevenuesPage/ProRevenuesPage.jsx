// @flow
import React from 'react';

import T from 'core/components/Translation';
import Toggle from 'core/components/Toggle';
import RevenuesByStatus from 'core/components/RevenuesByStatus';
import ProRevenuesPageContainer from './ProRevenuesPageContainer';

type ProRevenuesPageProps = {};

const ProRevenuesPage = ({
  loans,
  showNetRevenues,
  setShowNetRevenues,
  commissionRate = 0.25,
}: ProRevenuesPageProps) => (
  <div className="pro-revenues-page card1 card-top">
    <h1>
      <T id="ProRevenuesPage.title" />
    </h1>

    <Toggle
      toggled={showNetRevenues}
      onToggle={event => setShowNetRevenues(event.target.checked)}
      labelTop="Revenus nets"
    />
    <RevenuesByStatus
      loans={loans}
      multiplier={showNetRevenues ? commissionRate : 1}
    />
  </div>
);
export default ProRevenuesPageContainer(ProRevenuesPage);
