import React from 'react';

import T from 'core/components/Translation/';
import { AUCTION_STATUS } from 'core/api/constants';

import DashboardInfoInterestsTable from './DashboardInfoInterestsTable';

const DashboardInfoInterests = ({ loan }) => {
  const {
    _id,
    logic: {
      auction: { status },
    },
  } = loan;

  const auctionHasEnded = status === AUCTION_STATUS.ENDED;

  return (
    <div className="dashboard-info-team card1">
      <div className="card-top">
        <h3>
          <T id="LoanInterestRatesCard.title" />
        </h3>

        <h4>
          {auctionHasEnded ? (
            <T id="LoanInterestRatesCard.auctionEnded" />
          ) : (
            <T id="LoanInterestRatesCard.auctionOngoing" />
          )}
        </h4>

        <DashboardInfoInterestsTable
          loanId={_id}
          auctionHasEnded={auctionHasEnded}
        />
      </div>
    </div>
  );
};

export default DashboardInfoInterests;
