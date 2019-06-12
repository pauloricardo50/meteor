// @flow
import React from 'react';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import { loanInsertBorrowers } from 'core/api/methods';

type BorrowersAdderProps = {
  loanId: String,
};

const BorrowersAdder = ({ loanId }: BorrowersAdderProps) => (
  <div className="borrowers-adder">
    <div className="card1">
      <h1>Combien êtes-vous à emprunter ?</h1>
      <p className="description">
        Vous pourrez changer ce réglage par la suite
      </p>
      <div className="flex-row center space-children">
        <Button
          onClick={() => loanInsertBorrowers.run({ loanId, number: 1 })}
          raised
          primary
        >
          <div className="flex-row center space-children">
            <Icon type="person" />
1 emprunteur
          </div>
        </Button>
        <Button
          onClick={() => loanInsertBorrowers.run({ loanId, number: 2 })}
          raised
          primary
        >
          <div className="flex-row center space-children">
            <Icon type="people" />
2 emprunteurs
          </div>
        </Button>
      </div>
    </div>
  </div>
);

export default BorrowersAdder;
