// @flow
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import type { structureType } from '../../../api/types';
import FinancingStructuresLabels from './FinancingStructuresLabels';

type FinancingStructuresSectionProps = {
  topLabel: string,
  labels: Array<string>,
  structures: Array<structureType>,
  renderSummary: Function,
  renderDetail: Function,
};

const FinancingStructuresSection = ({
  topLabel,
  labels,
  structures,
  renderSummary,
  renderDetail,
}: FinancingStructuresSectionProps) => (
  <ExpansionPanel className="financing-structures-section">
    <ExpansionPanelSummary>
      <FinancingStructuresLabels labels={[topLabel]} />
      {structures.map(structure => (
        <div className="structure" key={structure.id}>
          {renderSummary(structure)}
        </div>
      ))}
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <FinancingStructuresLabels labels={labels} />
      {structures.map(structure => (
        <div className="structure card1" key={structure.id}>
          {renderDetail(structure)}
        </div>
      ))}
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

export default FinancingStructuresSection;
