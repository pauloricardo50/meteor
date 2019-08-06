// @flow
import React from 'react';

import T from 'core/components/Translation';
import RevenuesByStatus from 'core/components/RevenuesByStatus';
import ProRevenuesPageContainer from './ProRevenuesPageContainer';
import ProRevenuesPageExplained from './ProRevenuesExplained';

type ProRevenuesPageProps = {};

const ProRevenuesPage = ({
  loans = [],
  organisation: { commissionRate = 0 },
}: ProRevenuesPageProps) => (
  <div className="pro-revenues-page card1 card-top">
    <h1>
      <T id="ProRevenuesPage.title" />
    </h1>
    <h3 className="secondary">
      <T id="ProRevenuesPage.loanCount" values={{ value: loans.length }} />
    </h3>

    <ProRevenuesPageExplained />

    <RevenuesByStatus loans={loans} multiplier={commissionRate} />
  </div>
);

export default ProRevenuesPageContainer(ProRevenuesPage);
