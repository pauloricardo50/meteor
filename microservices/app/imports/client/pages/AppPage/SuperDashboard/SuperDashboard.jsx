import React from 'react';

import { appUser } from 'core/api/users/queries';
import Loading from 'core/components/Loading/Loading';
import NotFound from 'core/components/NotFound/NotFound';
import T from 'core/components/Translation';
import useMeteorData from 'core/hooks/useMeteorData';

import LoanCards from './LoanCards';

const SuperDashboard = () => {
  const { data, loading } = useMeteorData({
    query: appUser,
    type: 'single',
    params: {
      $body: {
        name: 1,
        loans: {
          name: 1,
          customName: 1,
          purchaseType: 1,
          hasPromotion: 1,
          hasProProperty: 1,
          promotions: { address: 1, documents: { promotionImage: 1 } },
          properties: { address: 1, documents: { PROPERTY_PICTURES: 1 } },
          step: 1,
          borrowers: { name: 1 },
        },
      },
    },
  });

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return <NotFound />;
  }

  const { loans = [], name } = data;

  return (
    <div className="super-dashboard">
      <div className="super-dashboard-title">
        <h1>
          <T id="SuperDashboard.welcome" values={{ name }} />
        </h1>
        <p>
          <T id="SuperDashboard.welcome.subtitle" />
        </p>
      </div>
      <LoanCards loans={loans} />
    </div>
  );
};

export default SuperDashboard;
