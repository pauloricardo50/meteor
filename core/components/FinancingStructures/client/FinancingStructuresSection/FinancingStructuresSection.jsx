// @flow
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withStyles } from '@material-ui/core/styles';
import { ScrollSyncPane } from 'react-scroll-sync';
import { compose, withState } from 'recompose';
import cx from 'classnames';

import T from '../../../Translation';
import type { structureType } from '../../../../api/types';
import FinancingStructuresLabels from '../FinancingStructuresLabels';
import { makeRenderDetail } from './financingStructuresSectionHelpers';
import FinancingStructuresDataContainer from '../containers/FinancingStructuresDataContainer';

type configArray = Array<{
  Component: React.Component,
  id: string,
  label?: React.Node,
  labelKey: number,
  changeLabelKey: Function,
}>;

type FinancingStructuresSectionProps = {
  data: Object,
  summaryConfig: configArray,
  detailConfig: configArray,
  className?: string,
  expanded: boolean,
  changeExpanded: Function,
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
  detailConfig,
  summaryConfig,
  className,
  classes: { container, entered, content, expanded: expandedClass },
  expanded,
  changeExpanded,
  ...data
}: FinancingStructuresSectionProps) => {
  const { structures } = data;
  const renderDetail = makeRenderDetail(detailConfig);
  const renderSummary = makeRenderDetail(summaryConfig);
  return (
    <ScrollSyncPane>
      <ExpansionPanel
        className={cx('financing-structures-section', className)}
        CollapseProps={{ classes: { container, entered } }}
        expanded={expanded}
        onChange={() => changeExpanded(!expanded)}
      >
        <ExpansionPanelSummary
          className="section-summary"
          classes={{ content, expanded: expandedClass }}
        >
          <div
            className={cx('expand-helper animated slideInDown', {
              appear: !expanded,
            })}
          >
            <T id="FinancingStructuresSection.expandHelper" />
          </div>
          <FinancingStructuresLabels
            config={summaryConfig}
            className="summary-labels"
          />

          {structures.map((structure, index) => (
            <div className="structure" key={structure.id}>
              {renderSummary(structure, data, index)}
            </div>
          ))}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className="section-detail">
          <FinancingStructuresLabels config={detailConfig} />

          {structures.map((structure, index) => (
            <div className="structure" key={structure.id}>
              <span className="card1">
                {renderDetail(structure, data, index)}
              </span>
            </div>
          ))}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </ScrollSyncPane>
  );
};

export default compose(
  withState('expanded', 'changeExpanded', false),
  FinancingStructuresDataContainer({ asArrays: true }),
  withStyles(styles),
)(FinancingStructuresSection);
