import React from 'react';
import CountUp from 'react-countup';

import {
  COMMISSION_STATUS,
  REVENUES_COLLECTION,
  REVENUE_STATUS,
} from 'core/api/revenues/revenueConstants';
import Button from 'core/components/Button';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { createRoute } from 'core/utils/routerUtils';

import ADMIN_ROUTES from '../../../../startup/client/adminRoutes';
import StatItem from './StatItem';

const UnpaidCommissions = () => {
  const { data: revenues = [] } = useStaticMeteorData({
    query: REVENUES_COLLECTION,
    params: {
      $filters: {
        status: REVENUE_STATUS.CLOSED,
        'organisationLinks.status': COMMISSION_STATUS.TO_BE_PAID,
      },
      amount: 1,
      organisationLinks: 1,
      loan: { name: 1 },
      assigneeLink: 1,
    },
    refetchOnMethodCall: false,
  });
  const total = revenues.reduce((tot, { amount, organisationLinks }) => {
    const totalRate = organisationLinks.reduce(
      (accumulatedRate, { status, commissionRate }) =>
        status === COMMISSION_STATUS.TO_BE_PAID
          ? accumulatedRate + commissionRate
          : accumulatedRate,
      0,
    );

    return tot + totalRate * amount;
  }, 0);
  const isOk = revenues.length === 0;

  return (
    <StatItem
      value={<CountUp end={total} prefix="CHF " preserveValue separator=" " />}
      positive={isOk}
      title="Commissions à payer"
      top={
        isOk ? (
          <p>Tout est bon!</p>
        ) : (
          <Button
            primary
            link
            to={createRoute(ADMIN_ROUTES.REVENUES_PAGE.path, {
              tabId: 'commissions',
            })}
          >
            Afficher liste
          </Button>
        )
      }
    />
  );
};

export default UnpaidCommissions;
