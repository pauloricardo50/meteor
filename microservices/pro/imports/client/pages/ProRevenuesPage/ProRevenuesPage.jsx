// @flow
import React from 'react';

import T from 'core/components/Translation';
import RevenuesByStatus from 'core/components/RevenuesByStatus';
import ProRevenuesPageContainer from './ProRevenuesPageContainer';

type ProRevenuesPageProps = {};

const ProRevenuesPage = ({
  loans = [],
  commissionRate = 0.25,
}: ProRevenuesPageProps) => (
  <div className="pro-revenues-page card1 card-top">
    <h1>
      <T id="ProRevenuesPage.title" />
    </h1>
    <h3 className="secondary">
      <T id="ProRevenuesPage.loanCount" values={{ value: loans.length }} />
    </h3>

    <RevenuesByStatus loans={loans} multiplier={commissionRate} />
  </div>
);

export default ProRevenuesPageContainer(ProRevenuesPage);
