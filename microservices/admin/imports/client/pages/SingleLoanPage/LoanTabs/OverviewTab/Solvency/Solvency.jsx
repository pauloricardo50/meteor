import React, { useState } from 'react';

import { CANTONS } from 'core/api/loans/loanConstants';
import { RESIDENCE_TYPE } from 'core/api/properties/propertyConstants';
import Button from 'core/components/Button';
import PercentInput from 'core/components/PercentInput';
import Select from 'core/components/Select';
import Toggle from 'core/components/Toggle';
import T from 'core/components/Translation';

import LenderSolvency from './LenderSolvency/LenderSolvency';
import SolvencyContainer from './SolvencyContainer';
import SolvencyResults from './SolvencyResults';

const Solvency = ({
  loan,
  organisations,
  showAll,
  setShowAll,
  singleLender,
  setSingleLender,
  residenceType,
  setResidenceType,
  canton,
  setCanton,
}) => {
  const [showResults, setShowResults] = useState(false);
  const [maxBorrowRatio, setMaxborrowRatio] = useState(0.8);

  return (
    <div className="card1 card-top solvency">
      <form
        className="flex"
        onSubmit={e => {
          e.preventDefault();
          setShowResults(false);
          setTimeout(() => setShowResults(true), 0);
        }}
      >
        <div className="flex-col">
          <h3>Capacité d'achat</h3>
          <Toggle
            value={singleLender}
            onToggle={setSingleLender}
            labelLeft={<small>Un prêteur</small>}
          />
        </div>

        {!singleLender && (
          <PercentInput value={maxBorrowRatio} onChange={setMaxborrowRatio} />
        )}

        {singleLender && (
          <Select
            options={organisations.map(({ _id, name }) => ({
              value: _id,
              label: name,
            }))}
            onChange={setSingleLender}
            value={singleLender && singleLender !== true ? singleLender : null}
            className="organisation-select"
          />
        )}
        {singleLender && (
          <Select
            options={Object.values(RESIDENCE_TYPE).map(value => ({
              value,
              label: <T id={`Forms.residenceType.${value}`} />,
            }))}
            onChange={setResidenceType}
            value={residenceType}
          />
        )}
        {singleLender && (
          <Select
            options={Object.keys(CANTONS).map(value => ({
              value,
              label: <T id={`Forms.canton.${value}`} />,
            }))}
            onChange={setCanton}
            value={canton}
          />
        )}

        <Button primary raised style={{ marginLeft: 8 }} type="submit">
          Calculer
        </Button>
      </form>

      {!!(singleLender && singleLender !== true) && (
        <LenderSolvency
          organisation={organisations.find(({ _id }) => _id === singleLender)}
          loan={loan}
          residenceType={residenceType}
          canton={canton}
        />
      )}

      {!singleLender && showResults && (
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
