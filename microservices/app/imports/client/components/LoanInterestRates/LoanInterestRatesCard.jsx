import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import T from 'core/components/Translation/';
import { AUCTION_STATUS } from 'core/api/constants';

import LoanInterestRatesTable from './LoanInterestRatesTable';

const LoanInterestRatesCard = ({ loan }) => {
  const {
    _id,
    logic: {
      auction: { status },
    },
  } = loan;

  const hasAuctionEnded = status === AUCTION_STATUS.ENDED;

  return (
    <div className="dashboard-info-team card1">
      <div className="card-top">
        <h3>
          <T id="LoanInterestRatesCard.title" />
        </h3>

        <h4>
          {hasAuctionEnded ? (
            <T id="LoanInterestRatesCard.auctionEnded" />
          ) : (
            <T id="LoanInterestRatesCard.auctionOngoing" />
          )}
        </h4>

        <LoanInterestRatesTable
          loanId={_id}
          hasAuctionEnded={hasAuctionEnded}
        />
      </div>
    </div>
  );
};

export default LoanInterestRatesCard;
