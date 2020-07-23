import React from 'react';

import { loanInsertBorrowers } from 'core/api/loans/methodDefinitions';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';

const BorrowersAdder = ({ loanId }) => (
  <div className="borrowers-adder animated fadeIn">
    <h3>
      <T id="BorrowersPage.BorrowerAdder.title" />
    </h3>
    <p className="description secondary">
      <T id="BorrowersPage.BorrowerAdder.description" />
    </p>
    <div className="flex-row center space-children">
      <Button
        onClick={() => loanInsertBorrowers.run({ loanId, amount: 1 })}
        raised
        secondary
        icon={<Icon type="person" />}
        size="large"
      >
        <T id="BorrowersPage.BorrowerAdder.singleBorrower" />
      </Button>
      <Button
        onClick={() => loanInsertBorrowers.run({ loanId, amount: 2 })}
        raised
        secondary
        icon={<Icon type="people" />}
        size="large"
      >
        <T id="BorrowersPage.BorrowerAdder.twoBorrowers" />
      </Button>
    </div>
  </div>
);

export default BorrowersAdder;
