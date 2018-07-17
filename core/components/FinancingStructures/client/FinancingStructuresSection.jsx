// @flow
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withStyles } from '@material-ui/core/styles';
import { ScrollSyncPane } from 'react-scroll-sync';

import type { structureType } from '../../../api/types';
import FinancingStructuresLabels from './FinancingStructuresLabels';

type FinancingStructuresSectionProps = {
  titleId: string,
  topLabel: string,
  labels: Array<string>,
  structures: Array<structureType>,
  renderSummary: Function,
  renderDetail: Function,
};

const styles = {
  container: {
    overflow: 'visible',
  },
};

const FinancingStructuresSection = ({
  titleId,
  topLabel,
  labels,
  structures,
  renderSummary,
  renderDetail,
  classes,
}: FinancingStructuresSectionProps) => (
  <ScrollSyncPane>
    <ExpansionPanel
      className="financing-structures-section"
      CollapseProps={{ classes }}
    >
      <ExpansionPanelSummary className="section-summary">
        <FinancingStructuresLabels labels={[titleId, topLabel]} />
        {structures.map((structure, index) => (
          <div className="structure" key={structure.id}>
            {renderSummary(structure, index)}
          </div>
        ))}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className="section-detail" classes={classes}>
        <FinancingStructuresLabels labels={labels} />
        {structures.map((structure, index) => (
          <div className="structure" key={structure.id}>
            <span className="card1">{renderDetail(structure, index)}</span>
          </div>
        ))}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </ScrollSyncPane>
);

export default withStyles(styles)(FinancingStructuresSection);
