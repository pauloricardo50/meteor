// @flow
import React, { useState } from 'react';

import Button from 'core/components/Button';
import PercentInput from 'core/components/PercentInput';
import { RESIDENCE_TYPE } from 'core/api/constants';
import SolvencyContainer from './SolvencyContainer';
import SolvencyItem from './SolvencyItem';

type SolvencyProps = {};

const results = (loan, maxBorrowRatio, organisations) => (
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
          <SolvencyItem
            loan={loan}
            maxBorrowRatio={maxBorrowRatio}
            residenceType={RESIDENCE_TYPE.MAIN_RESIDENCE}
            canton="GE"
            organisations={organisations}
          />
        </td>
        <td>
          <SolvencyItem
            loan={loan}
            maxBorrowRatio={maxBorrowRatio}
            residenceType={RESIDENCE_TYPE.MAIN_RESIDENCE}
            canton="VD"
            organisations={organisations}
          />
        </td>
      </tr>
      <tr>
        <td>Résidence secondaire</td>
        <td>
          <SolvencyItem
            loan={loan}
            maxBorrowRatio={maxBorrowRatio}
            residenceType={RESIDENCE_TYPE.SECOND_RESIDENCE}
            canton="GE"
            organisations={organisations}
          />
        </td>
        <td>
          <SolvencyItem
            loan={loan}
            maxBorrowRatio={maxBorrowRatio}
            residenceType={RESIDENCE_TYPE.SECOND_RESIDENCE}
            canton="VD"
            organisations={organisations}
          />
        </td>
      </tr>
    </tablebody>
  </table>
);

const Solvency = ({ loan, organisations }: SolvencyProps) => {
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

      {showResults && results(loan, maxBorrowRatio, organisations)}
    </div>
  );
};

export default SolvencyContainer(Solvency);
