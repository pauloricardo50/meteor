// @flow
import React from 'react';

import T from 'core/components/Translation';
import { SUCCESS } from 'core/api/constants';
import FinancingStructuresSection, {
  InputAndSlider,
  CalculatedValue,
} from '../FinancingStructuresSection';
import Calculator from '../../../../utils/Calculator';
import { getProperty } from '../FinancingStructuresCalculator';
import { calculateLoan } from '../FinancingStructuresFinancing/FinancingStructuresFinancing';
import StatusIcon from '../../../StatusIcon';

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

const calculateRequiredOwnFunds = (data) => {
  const { propertyWork } = data.structure;
  const propertyValue = getProperty(data).value;
  const effectiveLoan = calculateLoan(data);
  const fundsRequired = propertyValue * (1 + Calculator.getNotaryFeesRate())
    + propertyWork
    - effectiveLoan;
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
        Component: propz => (
          <CalculatedValue
            {...propz}
            rightElement={value =>
              (value === 0 ? (
                <StatusIcon status={SUCCESS} style={{ marginLeft: 8 }} />
              ) : null)
            }
          />
        ),
        id: 'requiredOwnFunds',
        value: calculateRequiredOwnFunds,
      },
      {
        Component: InputAndSlider,
        id: 'fortuneUsed',
        max: calculateMaxFortune,
      },
      {
        Component: InputAndSlider,
        id: 'secondPillarPledged',
        max: calculateMaxSecondPillarPledged,
        condition: makeConditionForValue('getSecondPillar'),
      },
      {
        Component: InputAndSlider,
        id: 'secondPillarWithdrawal',
        max: calculateMaxSecondPillarWithdrawal,
        condition: makeConditionForValue('getSecondPillar'),
      },
      {
        Component: InputAndSlider,
        id: 'thirdPillarPledged',
        max: calculateMaxThirdPillarPledged,
        condition: makeConditionForValue('getThirdPillar'),
      },
      {
        Component: InputAndSlider,
        id: 'thirdPillarWithdrawal',
        max: calculateMaxThirdPillarWithdrawal,
        condition: makeConditionForValue('getThirdPillar'),
      },
    ]}
  />
);

export default FinancingStructuresOwnFunds;
