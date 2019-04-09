// @flow
import React from 'react';

import Calculator from 'core/utils/Calculator';
import { RESIDENCE_TYPE, CANTONS } from '../../api/constants';
import T from '../Translation';
import Select from '../Select';
import Button from '../Button';
import Icon from '../Icon';
import MaxPropertyValueResultsTable from './MaxPropertyValueResultsTable';

type MaxPropertyValueResultsProps = {
  loan: Object,
  recalculate: Function,
  state: String,
  residenceType: String,
  setResidenceType: Function,
};

const MaxPropertyValueResults = ({
  loan,
  residenceType,
  setResidenceType,
  onChangeCanton,
  canton,
  loading,
  recalculate,
}: MaxPropertyValueResultsProps) => {
  const {
    maxPropertyValue: { main, second, borrowerHash },
    borrowers,
  } = loan;
  const hash = Calculator.getBorrowerFormHash({ loan });
  const shouldRecalculate = borrowerHash != hash;

  return (
    <div className="max-property-value-results animated fadeIn">
      <div className="top">
        <div>
          <h2>Capacité d'achat maximale</h2>
        </div>
        <div className="max-property-value-results-selects">
          <Select
            value={canton}
            onChange={onChangeCanton}
            options={Object.keys(CANTONS).map((shortCanton) => {
              const cant = CANTONS[shortCanton];
              return { id: shortCanton, label: cant };
            })}
            disabled={loading}
          />

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
            disabled={loading}
          />
        </div>
      </div>
      <div className="max-property-value-results-table">
        <MaxPropertyValueResultsTable
          {...(residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE ? main : second)}
          residenceType={residenceType}
          canton={canton}
        />
      </div>
      <Button
        raised
        secondary={shouldRecalculate}
        onClick={recalculate}
        icon={<Icon type="loop" />}
      >
        Recalculer
      </Button>
    </div>
  );
};

export default MaxPropertyValueResults;
