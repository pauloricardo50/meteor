// @flow
import React from 'react';

import T from 'core/components/Translation';
import FinancingStructuresSection, {
  InputAndSlider,
  CalculatedValue,
} from '../FinancingStructuresSection';
import BorrowerUtils from '../../../../utils/BorrowerUtils';

type FinancingStructuresOwnFundsProps = {};

const calculateOwnFunds = ({
  structure: { fortuneUsed, secondPillarWithdrawal, thirdPillarWithdrawal },
}) => fortuneUsed + secondPillarWithdrawal + thirdPillarWithdrawal;

const calculateMaxFortune = ({ borrowers }) => BorrowerUtils.getFortune({ borrowers });

const calculateMaxSecondPillarPledged = ({
  borrowers,
  structure: { secondPillarWithdrawal },
}) => BorrowerUtils.getSecondPillar({ borrowers })
  - secondPillarWithdrawal;

const calculateMaxSecondPillarWithdrawal = ({
  borrowers,
  structure: { secondPillarPledged },
}) => BorrowerUtils.getSecondPillar({ borrowers }) - secondPillarPledged;

const calculateMaxThirdPillarPledged = ({
  borrowers,
  structure: { thirdPillarWithdrawal },
}) => BorrowerUtils.getThirdPillar({ borrowers })
  - thirdPillarWithdrawal;

const calculateMaxThirdPillarWithdrawal = ({
  borrowers,
  structure: { thirdPillarPledged },
}) => BorrowerUtils.getThirdPillar({ borrowers }) - thirdPillarPledged;

const makeConditionForValue = funcName => ({ borrowers }) => BorrowerUtils[funcName]({ borrowers }) > 0;

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
