// @flow
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withStyles } from '@material-ui/core/styles';
import { ScrollSyncPane } from 'react-scroll-sync';
import { compose } from 'recompose';
import cx from 'classnames';

import type { structureType } from '../../../../api/types';
import StructuresContainer from '../containers/StructuresContainer';
import FinancingStructuresLabels from '../FinancingStructuresLabels';
import { makeRenderDetail } from './financingStructuresSectionHelpers';

type configArray = Array<{
  Component: React.Component,
  id: string,
  label?: React.Node,
  labelKey: number,
  changeLabelKey: Function,
}>;

type FinancingStructuresSectionProps = {
  structures: Array<structureType>,
  summaryConfig: configArray,
  detailConfig: configArray,
  className?: string,
};

const styles = {
  container: {
    overflow: 'visible',
    overflowY: 'hidden',
  },
  entered: {
    overflowY: 'visible',
  },
  content: {
    margin: 0,
    '& > :last-child': {
      paddingRight: 0,
    },
    '&$expanded': {
      margin: 0,
    },
  },
  expanded: {},
};

const FinancingStructuresSection = ({
  structures,
  detailConfig,
  summaryConfig,
  className,
  classes: { container, entered, content, expanded },
}: FinancingStructuresSectionProps) => {
  const renderDetail = makeRenderDetail(detailConfig);
  const renderSummary = makeRenderDetail(summaryConfig);
  return (
    <ScrollSyncPane>
      <ExpansionPanel
        className={cx('financing-structures-section', className)}
        CollapseProps={{ classes: { container, entered } }}
      >
        <ExpansionPanelSummary
          className="section-summary"
          classes={{ content, expanded }}
        >
          <FinancingStructuresLabels
            config={summaryConfig}
            className="summary-labels"
          />

          {structures.map((structure, index) => (
            <div className="structure" key={structure.id}>
              {renderSummary(structure, structures, index)}
            </div>
          ))}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className="section-detail">
          <FinancingStructuresLabels config={detailConfig} />

          {structures.map((structure, index) => (
            <div className="structure" key={structure.id}>
              <span className="card1">
                {renderDetail(structure, structures, index)}
              </span>
            </div>
          ))}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </ScrollSyncPane>
  );
};

export default compose(
  StructuresContainer,
  withStyles(styles),
)(FinancingStructuresSection);
