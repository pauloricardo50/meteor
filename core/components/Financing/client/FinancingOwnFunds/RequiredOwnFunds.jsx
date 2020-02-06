//
import React from 'react';

import { CalculatedValue } from '../FinancingSection';
import StructureUpdateContainer from '../containers/StructureUpdateContainer';
import Calculator from '../../../../utils/Calculator';
import RequiredOwnFundsBody from './RequiredOwnFundsBody';

const RequiredOwnFunds = props => {
  const {
    updateStructure,
    loan,
    structureId,
    calculateValue,
    structure: { disableForms },
  } = props;
  return (
    <CalculatedValue
      {...props}
      value={calculateValue}
      className="requiredOwnFunds requiredOwnFunds-component"
    >
      {value => (
        <RequiredOwnFundsBody
          suggestStructure={() => {
            const ownFunds = Calculator.suggestStructureForLoan({
              loan,
              structureId,
            });
            updateStructure({ ownFunds });
          }}
          disableForms={disableForms}
          {...props}
          value={value}
        />
      )}
    </CalculatedValue>
  );
};

export default StructureUpdateContainer(RequiredOwnFunds);
