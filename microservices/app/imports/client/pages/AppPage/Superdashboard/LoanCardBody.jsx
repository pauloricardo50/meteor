// @flow
import React from 'react';

import { createRoute } from 'core/utils/routerUtils';
import BorrowersSummary from 'core/components/BorrowersSummary';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import LoanProgress from './LoanProgress';

type LoanCardBodyProps = {
  loan: Object,
  history: Object,
};

const LoanCardBody = ({ loan, history }: LoanCardBodyProps) => {
  const { _id: loanId, borrowers = [], step } = loan;
  return (
    <div className="loancard-body">
      <div className="borrowers">
        <h4 className="secondary">
          <T id="collection.borrowers" />
        </h4>
        <BorrowersSummary borrowers={borrowers} showTitle={false} />
      </div>
      <LoanProgress step={step} />
      <Button
        onClick={() =>
          history.push(createRoute('/loans/:loanId', {
            loanId,
          }))
        }
        primary
        raised
        className="button-link"
      >
        <T id="Superdashboard.openLoan" />
      </Button>
    </div>
  );
};

export default LoanCardBody;
