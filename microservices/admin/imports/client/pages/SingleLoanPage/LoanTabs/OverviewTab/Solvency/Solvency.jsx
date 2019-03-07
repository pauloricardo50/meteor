// @flow
import React, { useState } from 'react';

import Button from 'core/components/Button/Button';
import Calculator from 'imports/core/utils/Calculator';
import { Money } from 'core/components/Translation';
import PercentInput from 'imports/core/components/PercentInput';
import { RESIDENCE_TYPE } from 'core/api/constants';

type SolvencyProps = {};

const results = (loan, maxBorrowRatio) => (
  <table style={{ tableLayout: 'fixed' }}>
    <tablebody>
      <tr>
        <td />
        <td>Genève</td>
        <td>Vaud</td>
      </tr>
      <tr>
        <td>Résidence principale</td>
        <td>
          <Money
            value={Calculator.getMaxPropertyValueForLoan({
              loan,
              maxBorrowRatio,
              residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
              canton: 'GE',
            })}
          />
        </td>
        <td>
          <Money
            value={Calculator.getMaxPropertyValueForLoan({
              loan,
              maxBorrowRatio,
              residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
              canton: 'VD',
            })}
          />
        </td>
      </tr>
      <tr>
        <td>Résidence secondaire</td>
        <td>
          <Money
            value={Calculator.getMaxPropertyValueForLoan({
              loan,
              maxBorrowRatio,
              residenceType: RESIDENCE_TYPE.SECOND_RESIDENCE,
              canton: 'GE',
            })}
          />
        </td>
        <td>
          <Money
            value={Calculator.getMaxPropertyValueForLoan({
              loan,
              maxBorrowRatio,
              residenceType: RESIDENCE_TYPE.SECOND_RESIDENCE,
              canton: 'VD',
            })}
          />
        </td>
      </tr>
    </tablebody>
  </table>
);

const Solvency = ({ loan }: SolvencyProps) => {
  const [showResults, setShowResults] = useState(false);
  const [maxBorrowRatio, setMaxborrowRatio] = useState(0.8);

  return (
    <div className="card1 card-top solvency">
      <div className="flex">
        <h3>Capacité d'achat</h3>

        <PercentInput value={maxBorrowRatio} onChange={setMaxborrowRatio} />

        <Button
          primary
          raised
          onClick={() => {
            setShowResults(false);
            setTimeout(() => setShowResults(true), 0);
          }}
          style={{ marginLeft: 8 }}
        >
          Calculer
        </Button>
      </div>

      {showResults && results(loan, maxBorrowRatio)}
    </div>
  );
};

export default Solvency;
