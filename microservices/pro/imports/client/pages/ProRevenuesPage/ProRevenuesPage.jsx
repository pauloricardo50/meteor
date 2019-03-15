// @flow
import React from 'react';

import T from 'core/components/Translation';
import RevenuesByStatus from 'core/components/RevenuesByStatus';
import ProRevenuesPageContainer from './ProRevenuesPageContainer';

type ProRevenuesPageProps = {};

const ProRevenuesPage = ({ loans }: ProRevenuesPageProps) => {
  console.log('loans:', loans);

  return (
    <div className="pro-revenues-page card1 card-top">
      <h1>
        <T id="ProRevenuesPage.title" />
      </h1>

      <RevenuesByStatus loans={loans} />
    </div>
  );
};
export default ProRevenuesPageContainer(ProRevenuesPage);
