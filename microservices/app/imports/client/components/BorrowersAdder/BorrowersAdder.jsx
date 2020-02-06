//
import React from 'react';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import { loanInsertBorrowers } from 'core/api/methods';

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
      >
        <div className="flex-row center space-children">
          <Icon type="person" />
          <p style={{ margin: 'unset' }}>
            <T id="BorrowersPage.BorrowerAdder.singleBorrower" />
          </p>
        </div>
      </Button>
      <Button
        onClick={() => loanInsertBorrowers.run({ loanId, amount: 2 })}
        raised
        secondary
      >
        <div className="flex-row center space-children">
          <Icon type="people" />
          <p style={{ margin: 'unset' }}>
            <T id="BorrowersPage.BorrowerAdder.twoBorrowers" />
          </p>
        </div>
      </Button>
    </div>
  </div>
);

export default BorrowersAdder;
