// @flow
import React from 'react';

import FinancingStructuresSection, {
  InputAndSlider,
  CalculatedValue,
} from '../FinancingStructuresSection';

type FinancingStructuresProjectProps = {};

const FinancingStructuresProject = (props: FinancingStructuresProjectProps) => (
  <FinancingStructuresSection
    summaryConfig={[
      { id: 'project', label: <h3 className="section-title">Projet</h3> },
      {
        id: 'projectCost',
        Component: CalculatedValue,
        value: ({ structure: { fortuneUsed } }) => fortuneUsed,
        money: true,
      },
    ]}
    detailConfig={[{ Component: InputAndSlider, id: 'fortuneUsed' }]}
  />
);

export default FinancingStructuresProject;
