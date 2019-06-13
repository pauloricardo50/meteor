// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import Calculator from 'core/utils/Calculator';
import { RESIDENCE_TYPE, CANTONS } from '../../api/constants';
import T from '../Translation';
import Select from '../Select';
import Button from '../Button';
import Icon from '../Icon';
import MaxPropertyValueResultsTable from './MaxPropertyValueResultsTable';
import MaxPropertyValueSharing from './MaxPropertyValueSharing';

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
  lockCanton,
  recalculate,
  cantonOptions,
}: MaxPropertyValueResultsProps) => {
  const {
    maxPropertyValue: { main, second, borrowerHash },
    hasProProperty,
    hasPromotion,
    shareSolvency,
    _id: loanId,
  } = loan;
  const hash = Calculator.getBorrowerFormHash({ loan });
  const shouldRecalculate = borrowerHash != hash;

  return (
    <div className="max-property-value-results animated fadeIn">
      <div className="top">
        <div>
          <h2>
            <T id="MaxPropertyValue.title" />
          </h2>
        </div>
        <div className="max-property-value-results-selects">
          {lockCanton ? <p className="secondary" style={{fontSize: '1.3rem', marginTop: 8, textTransform: 'uppercase'}}><T id={`Forms.canton.${canton}`}/></p> : <Select
            value={canton}
            onChange={onChangeCanton}
            options={cantonOptions}
            disabled={loading}
          />}

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
        disabled={Meteor.microservice === 'app' && !shouldRecalculate}
        secondary={shouldRecalculate}
        onClick={recalculate}
        icon={<Icon type="loop" />}
      >
        Recalculer
      </Button>
      <MaxPropertyValueSharing
        hasProProperty={hasProProperty}
        hasPromotion={hasPromotion}
        shareSolvency={shareSolvency}
        loanId={loanId}
      />
    </div>
  );
};

export default MaxPropertyValueResults;
