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
  return (
    <Card className="loan-interest-rates-card">
      <h3>
        <CardHeader
          title={<T id="LoanInterestRatesCard.title" />}
          className="card-header"
        />
      </h3>
      <CardContent>
        <LoanInterestRatesTable
          loanId={_id}
          hasAuctionEnded={status === AUCTION_STATUS.ENDED}
        />
      </CardContent>
    </Card>
  );
};

export default LoanInterestRatesCard;
