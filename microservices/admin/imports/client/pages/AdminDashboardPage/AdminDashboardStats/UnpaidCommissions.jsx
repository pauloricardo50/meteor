//      
import React, { useContext } from 'react';
import CountUp from 'react-countup';

import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import {
  REVENUES_COLLECTION,
  REVENUE_STATUS,
  COMMISSION_STATUS,
} from 'core/api/constants';
import ADMIN_ROUTES from 'imports/startup/client/adminRoutes';
import Button from 'core/components/Button';
import { createRoute } from 'core/utils/routerUtils';
import CurrentUserContext from 'core/containers/CurrentUserContext';
import StatItem from './StatItem';

                                 

const UnpaidCommissions = (props                        ) => {
  const currentUser = useContext(CurrentUserContext);
  const { data: revenues = [], loading } = useStaticMeteorData({
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
  });
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
            Résoudre le problème
          </Button>
        )
      }
    />
  );
};

export default UnpaidCommissions;
