// @flow
import React from 'react';

import { CalculatedValue } from '../FinancingSection';
import StructureUpdateContainer from '../containers/StructureUpdateContainer';
import Calculator from '../../../../utils/Calculator';
import RequiredOwnFundsBody from './RequiredOwnFundsBody';

type RequiredOwnFundsProps = {};

const RequiredOwnFunds = (props: RequiredOwnFundsProps) => {
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
          value={value}
          suggestStructure={() => {
            const ownFunds = Calculator.suggestStructureForLoan({
              loan,
              structureId,
            });
            updateStructure({ ownFunds });
          }}
          disableForms={disableForms}
          loan={loan}
        />
      )}
    </CalculatedValue>
  );
};

export default StructureUpdateContainer(RequiredOwnFunds);
