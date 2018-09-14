// @flow
import React from 'react';

import T from 'core/components/Translation';
import FinancingStructuresSection, {
  CalculatedValue,
} from '../FinancingStructuresSection';
import Calculator from '../../../../utils/Calculator';
import { getPropertyValue } from '../FinancingStructuresCalculator';
import { calculateLoan } from '../FinancingStructuresFinancing/FinancingStructuresFinancing';

import RequiredOwnFunds from './RequiredOwnFunds';
import OwnFundsLabel from './OwnFundsLabel';
import OwnFundsCompleter from './OwnFundsCompleter';
import {
  calculateOwnFunds,
  calculateRequiredOwnFunds,
  calculateMaxFortune,
  calculateMaxSecondPillarWithdrawal,
  makeConditionForValue,
  calculateMaxSecondPillarPledged,
  calculateMaxThirdPillarWithdrawal,
  calculateMaxThirdPillarPledged,
} from './ownFundsHelpers';

type FinancingStructuresOwnFundsProps = {};

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
