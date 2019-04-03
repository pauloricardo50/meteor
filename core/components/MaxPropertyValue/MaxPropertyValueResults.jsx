// @flow
import React from 'react';

import { RESIDENCE_TYPE } from '../../api/constants';
import T from '../Translation';
import Select from '../Select';
import MaxPropertyValueDialog from './MaxPropertyValueDialog';
import MaxPropertyValueResultsTable from './MaxPropertyValueResultsTable';

type MaxPropertyValueResultsProps = {
  loan: Object,
  calculateSolvency: Function,
  state: String,
  residenceType: String,
  setResidenceType: Function,
};

const MaxPropertyValueResults = ({
  loan,
  calculateSolvency,
  state,
  residenceType,
  setResidenceType,
}: MaxPropertyValueResultsProps) => {
  const {
    maxPropertyValue: { main, second, canton },
  } = loan;

  return (
    <div className="max-property-value-results">
      <div className="top">
        <div>
          <h2>Capacité d'achat maximale</h2>
          <h2>
            <small className="secondary">
              <T id={`Forms.canton.${canton}`} />
            </small>
          </h2>
        </div>
        <div>
          <Select
            value={residenceType}
            onChange={(_, val) => setResidenceType(val)}
            options={Object.values(RESIDENCE_TYPE)
              .filter(type =>
                [
                  RESIDENCE_TYPE.MAIN_RESIDENCE,
                  RESIDENCE_TYPE.SECOND_RESIDENCE,
                ].includes(type))
              .map(type => ({
                id: type,
                label: <T id={`Forms.residenceType.${type}`} />,
              }))}
          />
        </div>
      </div>
      <MaxPropertyValueResultsTable
        {...(residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE ? main : second)}
      />
      <MaxPropertyValueDialog
        loan={loan}
        calculateSolvency={calculateSolvency}
        state={state}
      />
    </div>
  );
};

export default MaxPropertyValueResults;
