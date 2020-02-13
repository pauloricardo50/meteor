import React, { useContext } from 'react';
import CountUp from 'react-countup';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import { REVENUE_STATUS, REVENUES_COLLECTION } from 'core/api/constants';
import Button from 'core/components/Button';
import { createRoute } from 'core/utils/routerUtils';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import ADMIN_ROUTES from '../../../../startup/client/adminRoutes';
import StatItem from './StatItem';

const OutdatedRevenues = ({ revenues }) => {
  console.log('revenues:', revenues);
  const currentUser = useContext(CurrentUserContext);
  console.log('currentUser:', currentUser);
  const total = revenues.reduce((tot, { amount }) => tot + amount, 0);
  const myRevenues = revenues.filter(
    ({ assigneeLink }) => assigneeLink?._id === currentUser?._id,
  );
  const isOk = myRevenues.length === 0;
  console.log('myRevenues:', myRevenues);

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
  query: REVENUES_COLLECTION,
  params: {
    $filters: {
      status: REVENUE_STATUS.EXPECTED,
      expectedAt: { $lte: new Date() },
    },
    amount: 1,
    assigneeLink: 1,
  },
  dataName: 'revenues',
})(OutdatedRevenues);
