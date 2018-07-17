// @flow
import React from 'react';

import FinancingStructuresSection from '../FinancingStructuresSection';

type FinancingStructuresProjectProps = {};

const FinancingStructuresProject = ({
  structures,
}: FinancingStructuresProjectProps) => (
  <FinancingStructuresSection
    titleId="project"
    structures={structures}
    labels={['value']}
    topLabel="Coût"
    renderSummary={(structure, index) => <span>{index}</span>}
    renderDetail={(structure, index) => <span>{index}</span>}
  />
);

export default FinancingStructuresProject;
