// @flow
import React, { useState } from 'react';

import Button from 'core/components/Button';
import PercentInput from 'core/components/PercentInput';
import SolvencyContainer from './SolvencyContainer';
import SolvencyResults from './SolvencyResults';

type SolvencyProps = {};

const Solvency = ({
  loan,
  organisations,
  showAll,
  setShowAll,
}: SolvencyProps) => {
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

      {showResults && (
        <SolvencyResults
          loan={loan}
          maxBorrowRatio={maxBorrowRatio}
          organisations={organisations}
          showAll={showAll}
          setShowAll={setShowAll}
        />
      )}
    </div>
  );
};

export default SolvencyContainer(Solvency);
