// @flow
import React from 'react';

import T from 'core/components/Translation';
import FinancingStructuresSection, {
  InputAndSlider,
  CalculatedValue,
} from '../FinancingStructuresSection';
import Calculator from '../../../../utils/Calculator';
import { getPropertyValue } from '../FinancingStructuresCalculator';
import { calculateLoan } from '../FinancingStructuresFinancing/FinancingStructuresFinancing';

import RequiredOwnFunds from './RequiredOwnFunds';
import OwnFundsLabel from './OwnFundsLabel';
import OwnFundsCompleter from './OwnFundsCompleter';

type FinancingStructuresOwnFundsProps = {};

const calculateOwnFunds = ({
  structure: { fortuneUsed, secondPillarWithdrawal, thirdPillarWithdrawal },
}) => fortuneUsed + secondPillarWithdrawal + thirdPillarWithdrawal;

const calculateMaxFortune = ({ borrowers }) =>
  Calculator.getFortune({ borrowers });

const calculateMaxSecondPillarPledged = ({
  borrowers,
  structure: { secondPillarWithdrawal },
}) => Calculator.getSecondPillar({ borrowers }) - secondPillarWithdrawal;

const calculateMaxSecondPillarWithdrawal = ({
  borrowers,
  structure: { secondPillarPledged },
}) => Calculator.getSecondPillar({ borrowers }) - secondPillarPledged;

const calculateMaxThirdPillarPledged = ({
  borrowers,
  structure: { thirdPillarWithdrawal },
}) => Calculator.getThirdPillar({ borrowers }) - thirdPillarWithdrawal;

const calculateMaxThirdPillarWithdrawal = ({
  borrowers,
  structure: { thirdPillarPledged },
}) => Calculator.getThirdPillar({ borrowers }) - thirdPillarPledged;

const makeConditionForValue = funcName => ({ borrowers }) =>
  Calculator[funcName]({ borrowers }) > 0;

export const calculateRequiredOwnFunds = (data) => {
  const { propertyWork, notaryFees } = data.structure;
  const propertyValue = getPropertyValue(data);
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
        Component: OwnFundsCompleter,
        id: 'fortuneUsed',
        max: calculateMaxFortune,
        label: OwnFundsLabel,
        labelValue: calculateMaxFortune,
      },
      {
        Component: OwnFundsCompleter,
        id: 'secondPillarWithdrawal',
        max: calculateMaxSecondPillarWithdrawal,
        condition: makeConditionForValue('getSecondPillar'),
        label: OwnFundsLabel,
        labelValue: Calculator.getSecondPillar,
      },
      {
        Component: OwnFundsCompleter,
        id: 'secondPillarPledged',
        max: calculateMaxSecondPillarPledged,
        condition: makeConditionForValue('getSecondPillar'),
        label: OwnFundsLabel,
        labelValue: Calculator.getSecondPillar,
      },
      {
        Component: OwnFundsCompleter,
        id: 'thirdPillarWithdrawal',
        max: calculateMaxThirdPillarWithdrawal,
        condition: makeConditionForValue('getThirdPillar'),
        label: OwnFundsLabel,
        labelValue: Calculator.getThirdPillar,
      },
      {
        Component: OwnFundsCompleter,
        id: 'thirdPillarPledged',
        max: calculateMaxThirdPillarPledged,
        condition: makeConditionForValue('getThirdPillar'),
        label: OwnFundsLabel,
        labelValue: Calculator.getThirdPillar,
      },
    ]}
  />
);

export default FinancingStructuresOwnFunds;
