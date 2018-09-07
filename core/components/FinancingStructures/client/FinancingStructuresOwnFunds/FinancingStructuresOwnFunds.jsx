// @flow
import React from 'react';

import T from 'core/components/Translation';
import FinancingStructuresSection, {
  CalculatedValue,
} from '../FinancingStructuresSection';
import Calculator from '../../../../utils/Calculator';
import { getProperty } from '../FinancingStructuresCalculator';
import { calculateLoan } from '../FinancingStructuresFinancing/FinancingStructuresFinancing';

import RequiredOwnFunds from './RequiredOwnFunds';
import FinancingStructuresOwnFundsPicker from './FinancingStructuresOwnFundsPicker';

type FinancingStructuresOwnFundsProps = {};

export const calculateOwnFunds = ({
  structure: { fortuneUsed, secondPillarWithdrawal, thirdPillarWithdrawal },
}) => fortuneUsed + secondPillarWithdrawal + thirdPillarWithdrawal;

export const calculateMaxFortune = ({ borrowers }) =>
  Calculator.getFortune({ borrowers });

export const calculateMaxSecondPillarPledged = ({
  borrowers,
  structure: { secondPillarWithdrawal },
}) => Calculator.getSecondPillar({ borrowers }) - secondPillarWithdrawal;

export const calculateMaxSecondPillarWithdrawal = ({
  borrowers,
  structure: { secondPillarPledged },
}) => Calculator.getSecondPillar({ borrowers }) - secondPillarPledged;

export const calculateMaxThirdPillarPledged = ({
  borrowers,
  structure: { thirdPillarWithdrawal },
}) => Calculator.getThirdPillar({ borrowers }) - thirdPillarWithdrawal;

export const calculateMaxThirdPillarWithdrawal = ({
  borrowers,
  structure: { thirdPillarPledged },
}) => Calculator.getThirdPillar({ borrowers }) - thirdPillarPledged;

export const makeConditionForValue = funcName => ({ borrowers }) =>
  Calculator[funcName]({ borrowers }) > 0;

export const calculateRequiredOwnFunds = (data) => {
  const { propertyWork, notaryFees } = data.structure;
  const propertyValue = getProperty(data).value;
  const effectiveLoan = calculateLoan(data);
  const fees = Calculator.getFeesBase({
    fees: notaryFees,
    propertyValue,
    propertyWork,
  });
  return propertyValue + propertyWork + fees - effectiveLoan;
};

export const calculateMissingOwnFunds = (data) => {
  const { propertyWork, notaryFees } = data.structure;
  const propertyValue = getProperty(data).value;
  const effectiveLoan = calculateLoan(data);
  const fees = Calculator.getFeesBase({
    fees: notaryFees,
    propertyValue,
    propertyWork,
  });
  const fundsRequired = propertyValue + propertyWork + fees - effectiveLoan;
  const totalCurrentFunds = calculateOwnFunds(data);

  return fundsRequired - totalCurrentFunds;
};

const FinancingStructuresOwnFunds = (props: FinancingStructuresOwnFundsProps) => (
  <FinancingStructuresSection
    summaryConfig={[
      {
        id: 'ownFunds',
        label: (
          <span className="section-title">
            <T id="FinancingStructuresOwnFunds.title" />
          </span>
        ),
        Component: CalculatedValue,
        value: calculateOwnFunds,
      },
    ]}
    detailConfig={[
      {
        Component: RequiredOwnFunds,
        id: 'requiredOwnFunds',
        value: calculateRequiredOwnFunds,
      },
      {
        Component: FinancingStructuresOwnFundsPicker,
        id: 'ownFundsPicker',
      },
    ]}
  />
);

export default FinancingStructuresOwnFunds;
