//
import React, { useContext } from 'react';
import CountUp from 'react-countup';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import { adminRevenues } from 'core/api/revenues/queries';
import { REVENUE_STATUS } from 'core/api/constants';
import Button from 'core/components/Button';
import { createRoute } from 'core/utils/routerUtils';
import ADMIN_ROUTES from 'imports/startup/client/adminRoutes';
import CurrentUserContext from 'core/containers/CurrentUserContext';
import StatItem from './StatItem';

const OutdatedRevenues = ({ revenues }) => {
  const currentUser = useContext(CurrentUserContext);
  const total = revenues.reduce((tot, { amount }) => tot + amount, 0);
  const myRevenues = revenues.filter(
    ({ assigneeLink }) => assigneeLink?._id === currentUser?._id,
  );
  const isOk = myRevenues.length === 0;

  return (
    <StatItem
      value={<CountUp end={total} prefix="CHF " preserveValue separator=" " />}
      increment={`Dont ${myRevenues.length} à moi`}
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
              revenuesTabId: 'list',
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
  params: {
    status: REVENUE_STATUS.EXPECTED,
    expectedAt: { $lte: new Date() },
    $body: { amount: 1, assigneeLink: 1 },
  },
  dataName: 'revenues',
})(OutdatedRevenues);
