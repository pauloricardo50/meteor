import React from 'react';
import Tabs from 'core/components/Tabs';
import SingleBorrowerTab from './SingleBorrowerTab';

const BorrowersTab = props => (
  <Tabs
    tabs={props.borrowers.map((borrower, i) => ({
      id: borrower._id,
      label:
        borrower.firstName || borrower.lastName
          ? `${borrower.firstName} ${borrower.lastName}`
          : `Emprunteur ${i + 1}`,
      content: (
        <SingleBorrowerTab {...props} borrower={borrower} key={borrower._id} />
      ),
    }))}
  />
);

export default BorrowersTab;
