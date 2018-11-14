import React from 'react';

import Tabs from 'core/components/Tabs';
import ConfirmMethod from 'imports/core/components/ConfirmMethod';
import { addBorrower } from 'imports/core/api/methods/index';
import SingleBorrowerTab from './SingleBorrowerTab';

const BorrowersTab = (props) => {
  const { borrowers, loan } = props;

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
          label:
            borrower.firstName || borrower.lastName
              ? `${borrower.firstName} ${borrower.lastName}`
              : `Emprunteur ${i + 1}`,
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
