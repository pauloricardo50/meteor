// @flow
import React from 'react';

import { RESIDENCE_TYPE } from '../../api/constants';
import T from '../Translation';
import Toggle from '../Toggle';
import SolvencyCalculatorDialog from './SolvencyCalculatorDialog';
import SolvencyCalculatorResultsTable from './SolvencyCalculatorResultsTable';

type SolvencyCalculatorResultsProps = {
  loan: Object,
  calculateSolvency: Function,
  state: String,
  residenceType: String,
  setResidenceType: Function,
};

const SolvencyCalculatorResults = ({
  loan,
  calculateSolvency,
  state,
  residenceType,
  setResidenceType,
}: SolvencyCalculatorResultsProps) => {
  const {
    maxSolvency: { main, second, canton },
  } = loan;

  return (
    <div className="solvency-calculator-results">
      <h2>Capacité d'achat maximale</h2>
      <h2>
        {canton && (
          <small className="secondary">
            <T id={`Forms.canton.${canton}`} />
          </small>
        )}
      </h2>
      <Toggle
        toggled={residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE}
        onToggle={() =>
          setResidenceType(residenceType === RESIDENCE_TYPE.SECOND_RESIDENCE
            ? RESIDENCE_TYPE.MAIN_RESIDENCE
            : RESIDENCE_TYPE.SECOND_RESIDENCE)
        }
        labelLeft="Résidence secondaire"
        labelRight="Résidence principale"
      />
      <SolvencyCalculatorResultsTable
        {...(residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE ? main : second)}
      />
      <SolvencyCalculatorDialog
        loan={loan}
        calculateSolvency={calculateSolvency}
        state={state}
      />
    </div>
  );
};

export default SolvencyCalculatorResults;
