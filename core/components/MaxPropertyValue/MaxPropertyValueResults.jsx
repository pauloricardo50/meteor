import { Meteor } from 'meteor/meteor';

import React from 'react';

import { RESIDENCE_TYPE } from '../../api/properties/propertyConstants';
import Calculator from '../../utils/Calculator';
import Button from '../Button';
import Icon from '../Icon';
import Select from '../Select';
import T from '../Translation';
import MaxPropertyValueResultsTable from './MaxPropertyValueResultsTable';
import MaxPropertyValueSharing from './MaxPropertyValueSharing';

const getPropertyOrganisation = loan => {
  if (loan.hasProProperty && loan.properties.length === 1) {
    return loan.properties[0].organisation;
  }
};

const MaxPropertyValueResults = ({
  loan,
  residenceType,
  setResidenceType,
  onChangeCanton,
  loading,
  lockCanton,
  recalculate,
  cantonOptions,
  showSecondButton = true,
}) => {
  const {
    maxPropertyValue: { main, second, borrowerHash, canton },
    hasProProperty,
    hasPromotion,
    shareSolvency,
    _id: loanId,
    purchaseType,
  } = loan;
  const hash = Calculator.getBorrowerFormHash({ loan });
  const shouldRecalculate = borrowerHash != hash;

  return (
    <div className="max-property-value-results animated fadeIn">
      <div className="top">
        <div>
          <h2>
            <T id="MaxPropertyValue.title" values={{ purchaseType }} />
          </h2>
        </div>
        <div className="max-property-value-results-selects">
          {lockCanton ? (
            <p className="secondary locked-canton">
              <T id={`Forms.canton.${canton}`} />
            </p>
          ) : (
            <Select
              value={canton}
              onChange={onChangeCanton}
              options={cantonOptions}
              disabled={loading}
            />
          )}

          <Select
            value={residenceType}
            onChange={setResidenceType}
            options={Object.values(RESIDENCE_TYPE)
              .filter(type =>
                [
                  RESIDENCE_TYPE.MAIN_RESIDENCE,
                  RESIDENCE_TYPE.SECOND_RESIDENCE,
                ].includes(type),
              )
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
      {showSecondButton && (
        <MaxPropertyValueSharing
          hasProProperty={hasProProperty}
          hasPromotion={hasPromotion}
          shareSolvency={shareSolvency}
          loanId={loanId}
          propertyOrganisation={getPropertyOrganisation(loan)}
        />
      )}
    </div>
  );
};

export default MaxPropertyValueResults;
