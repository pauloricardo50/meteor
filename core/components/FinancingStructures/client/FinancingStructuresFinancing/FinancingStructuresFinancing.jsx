// @flow
import React from 'react';

import { AMORTIZATION_TYPE } from '../../../../api/constants';
import T from '../../../Translation';
import FinancingStructuresSection, {
  InputAndSlider,
  CalculatedValue,
  RadioButtons,
} from '../FinancingStructuresSection';

import Calc, { getProperty } from '../FinancingStructuresCalculator';

const getPledgedAmount = ({
  structure: { secondPillarPledged, thirdPillarPledged },
}) => secondPillarPledged + thirdPillarPledged;

export const calculateLoan = (params) => {
  const {
    structure: { wantedLoan },
  } = params;
  return wantedLoan + getPledgedAmount(params);
};

const calculateMaxLoan = data =>
  Calc.getMaxLoan({
    propertyWork: data.structure.propertyWork,
    propertyValue: getProperty(data).value,
  });

const oneStructureHasPledge = ({ structures }) =>
  structures.some(({ secondPillarPledged, thirdPillarPledged }) =>
    secondPillarPledged || thirdPillarPledged);

type FinancingStructuresFinancingProps = {};

const FinancingStructuresFinancing = (props: FinancingStructuresFinancingProps) => (
  <FinancingStructuresSection
    summaryConfig={[
      {
        id: 'mortgageLoan',
        label: (
          <span className="section-title">
            <T id="FinancingStructuresFinancing.title" />
          </span>
        ),
        Component: CalculatedValue,
        value: calculateLoan,
      },
    ]}
    detailConfig={[
      { Component: InputAndSlider, id: 'wantedLoan', max: calculateMaxLoan },
      {
        Component: RadioButtons,
        id: 'amortizationType',
        options: Object.values(AMORTIZATION_TYPE).map(key => ({
          id: key,
          label: `FinancingStructuresFinancing.${key}`,
        })),
      },
      {
        id: 'pledgedIncrease',
        Component: CalculatedValue,
        value: getPledgedAmount,
        condition: oneStructureHasPledge,
      },
    ]}
  />
);

export default FinancingStructuresFinancing;
