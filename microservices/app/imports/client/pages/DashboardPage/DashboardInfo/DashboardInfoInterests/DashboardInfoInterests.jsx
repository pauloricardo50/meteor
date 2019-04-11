import React from 'react';
import cx from 'classnames';

import T from 'core/components/Translation';
import Button from 'core/components/Button';
import { createRoute } from 'core/utils/routerUtils';
import { FINANCING_PAGE } from '../../../../../startup/client/appRoutes';
import DashboardInfoInterestsTable from './DashboardInfoInterestsTable';
import DashboardInfoInterestsContainer from './DashboardInfoInterestsContainer';

const DashboardInfoInterests = (props) => {
  const {
    loan: { enableOffers, _id: loanId },
    offers,
  } = props;

  return (
    <div className={cx('dashboard-info-team card1', { offers: enableOffers })}>
      <div className="card-top">
        <h3>
          <T
            id={
              enableOffers
                ? 'DashboardInfoInterests.offersTitle'
                : 'DashboardInfoInterests.title'
            }
          />
        </h3>
        {enableOffers && (
          <div className="dashboard-info-interests-offers">
            <h4 className="secondary">
              <T
                id="DashboardInfoInterests.subtitle"
                values={{ count: offers.length }}
              />
            </h4>
            <Button
              primary
              link
              to={createRoute(FINANCING_PAGE, { loanId })}
            >
              <T id="DashboardInfoInterests.link" values={{ count: offers.length }} />
            </Button>
          </div>
        )}

        <DashboardInfoInterestsTable {...props} />
      </div>
    </div>
  );
};

export default DashboardInfoInterestsContainer(DashboardInfoInterests);
