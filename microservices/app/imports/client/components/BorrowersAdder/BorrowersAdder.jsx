// @flow
import React from 'react';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import { loanInsertBorrowers } from 'core/api/methods';

type BorrowersAdderProps = {
  loanId: String,
};

const BorrowersAdder = ({ loanId }: BorrowersAdderProps) => (
  <div className="borrowers-adder">
    {/* <div className="card1"> */}
    <h3>
      <T id="BorrowersPage.BorrowerAdder.title" />
    </h3>
    <p className="description">
      <T id="BorrowersPage.BorrowerAdder.description" />
    </p>
    <div className="flex-row center space-children">
      <Button
        onClick={() => loanInsertBorrowers.run({ loanId, amount: 1 })}
        raised
        primary
      >
        <div className="flex-row center space-children">
          <Icon type="person" />
          <p style={{ margin: 'unset' }}>
            <T id="BorrowersPage.BorrowerAdder.buttonLabel.singleBorrower" />
          </p>
        </div>
      </Button>
      <Button
        onClick={() => loanInsertBorrowers.run({ loanId, amount: 2 })}
        raised
        primary
      >
        <div className="flex-row center space-children">
          <Icon type="people" />
          <p style={{ margin: 'unset' }}>
            <T id="BorrowersPage.BorrowerAdder.buttonLabel.twoBorrowers" />
          </p>
        </div>
      </Button>
    </div>
    {/* </div> */}
  </div>
);

export default BorrowersAdder;
