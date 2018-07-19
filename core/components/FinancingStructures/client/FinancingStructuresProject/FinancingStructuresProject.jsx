// @flow
import React from 'react';

import FinancingStructuresSection, {
  InputAndSlider,
  CalculatedValue,
} from '../FinancingStructuresSection';

type FinancingStructuresProjectProps = {};

const FinancingStructuresProject = ({
  structures,
}: FinancingStructuresProjectProps) => (
  <FinancingStructuresSection
    titleId="project"
    structures={structures}
    labels={['fortuneUsed']}
    topLabel="Coût"
    renderSummary={(structure, index) => <span>{index}</span>}
    summaryConfig={[
      { id: 'project', label: <h3 className="section-title">Projet</h3> },
      { id: 'projectCost', Component: CalculatedValue, value: 100 },
    ]}
    detailConfig={[{ Component: InputAndSlider, id: 'fortuneUsed' }]}
  />
);

export default FinancingStructuresProject;
