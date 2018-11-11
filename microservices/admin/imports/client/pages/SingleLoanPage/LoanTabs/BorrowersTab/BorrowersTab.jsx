import React from 'react';

import Tabs from 'core/components/Tabs';
import SingleBorrowerTab from './SingleBorrowerTab';

const BorrowersTab = (props) => {
  const { borrowers } = props;

  return borrowers && borrowers.length > 0 ? (
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
  ) : (
    <h2 className="secondary">Pas d'emprunteurs</h2>
  );
};

export default BorrowersTab;
