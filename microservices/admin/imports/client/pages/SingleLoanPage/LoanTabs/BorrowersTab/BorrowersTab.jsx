import React from 'react';

import Tabs from 'core/components/Tabs';
import PercentWithStatus from 'core/components/PercentWithStatus';
import ConfirmMethod from 'core/components/ConfirmMethod';
import { addBorrower } from 'core/api/methods';
import Calculator from 'core/utils/Calculator';
import SingleBorrowerTab from './SingleBorrowerTab';

const borrowersTabLabel = (borrower, index) => {
  const progress = Calculator.personalInfoPercent({ borrowers: borrower });
  return (
    <span className="single-loan-page-tabs-label">
      {borrower.name || `Emprunteur ${index + 1}`}
      &nbsp;&bull;&nbsp;
      <PercentWithStatus
        status={progress < 1 ? null : undefined}
        value={progress}
        rounded
      />
    </span>
  );
};

const BorrowersTab = (props) => {
  const { loan } = props;
  const { borrowers } = loan;

  return borrowers && borrowers.length > 0 ? (
    <div>
      <ConfirmMethod
        disabled={borrowers.length !== 1}
        method={() => addBorrower.run({ loanId: loan._id })}
        label="Ajouter emprunteur"
        buttonProps={{
          raised: true,
          primary: true,
          style: { marginBottom: 16 },
        }}
      />
      <Tabs
        tabs={borrowers.map((borrower, i) => ({
          id: borrower._id,
          label: borrowersTabLabel(borrower, i),
          content: (
            <SingleBorrowerTab
              {...props}
              borrower={borrower}
              key={borrower._id}
            />
          ),
        }))}
      />
    </div>
  ) : (
    <h2 className="secondary">Pas d'emprunteurs</h2>
  );
};

export default BorrowersTab;
