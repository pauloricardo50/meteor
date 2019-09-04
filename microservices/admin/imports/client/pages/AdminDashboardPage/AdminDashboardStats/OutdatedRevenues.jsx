// @flow
import React from 'react';
import CountUp from 'react-countup';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import { adminRevenues } from 'core/api/revenues/queries';
import { REVENUE_STATUS } from 'core/api/constants';
import Button from 'core/components/Button';
import { createRoute } from 'core/utils/routerUtils';
import ADMIN_ROUTES from 'imports/startup/client/adminRoutes';
import StatItem from './StatItem';

type OutdatedRevenuesProps = {};

const OutdatedRevenues = ({ revenues }: OutdatedRevenuesProps) => {
  const total = revenues.reduce((tot, { amount }) => tot + amount, 0);
  const isOk = revenues.length === 0;

  return (
    <StatItem
      value={<CountUp end={total} prefix="CHF " preserveValue separator=" " />}
      increment={`${revenues.length} revenus`}
      positive={isOk}
      title="Revenus en retard"
      top={
        isOk ? (
          <p>Tout est bon!</p>
        ) : (
          <Button
            primary
            link
            to={createRoute(ADMIN_ROUTES.REVENUES_PAGE.path, {
              tabId: 'revenues',
            })}
          >
            Résoudre le problème
          </Button>
        )
      }
    />
  );
};

export default withSmartQuery({
  query: adminRevenues,
  params: { status: REVENUE_STATUS.EXPECTED, expectedAt: { $lte: new Date() } },
  dataName: 'revenues',
})(OutdatedRevenues);
