// @flow
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { withStyles } from '@material-ui/core/styles';
import { ScrollSyncPane } from 'react-scroll-sync';
import { compose, withState, lifecycle } from 'recompose';
import cx from 'classnames';

import FinancingLabels from '../FinancingLabels';
import { makeRenderDetail, makeRenderSummary } from './financingSectionHelpers';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import ClientEventService from '../../../../api/events/ClientEventService';

type configArray = Array<{
  Component: React.Component,
  id: string,
  label?: React.Node,
  labelKey: number,
  changeLabelKey: Function,
}>;

type FinancingSectionProps = {
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

const FinancingSection = ({
  detailConfig,
  summaryConfig,
  className,
  classes: { container, entered, content, expanded: expandedClass },
  expanded,
  changeExpanded,
  noWrapper,
  ...sectionProps
}: FinancingSectionProps) => {
  const { structures } = sectionProps;
  const renderSummary = makeRenderSummary(summaryConfig);
  const renderDetail = makeRenderDetail(detailConfig, noWrapper);
  return (
    <ScrollSyncPane>
      <ExpansionPanel
        className={cx('financing-structures-section', className, { expanded })}
        CollapseProps={{ classes: { container, entered } }}
        expanded={expanded}
        onChange={() => changeExpanded(!expanded)}
      >
        <ExpansionPanelSummary
          className="section-summary"
          classes={{ content, expanded: expandedClass }}
        >
          <FinancingLabels config={summaryConfig} className="summary-labels" />

          {structures.map(structure => renderSummary(structure, sectionProps))}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className="section-detail">
          <FinancingLabels config={detailConfig} />

          {structures.map(structure => renderDetail(structure, sectionProps))}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </ScrollSyncPane>
  );
};

export default compose(
  FinancingDataContainer,
  withState(
    'expanded',
    'changeExpanded',
    ({ Calculator, loan }) => !Calculator.hasCompleteStructure({ loan }),
  ),
  lifecycle({
    componentDidMount() {
      const { changeExpanded } = this.props;
      ClientEventService.addListener('expandAll', () => changeExpanded(true));
      ClientEventService.addListener('collapseAll', () =>
        changeExpanded(false));
    },
    componentWillUnmount() {
      const { changeExpanded } = this.props;
      ClientEventService.removeListener('expandAll', () =>
        changeExpanded(true));
      ClientEventService.removeListener('collapseAll', () =>
        changeExpanded(false));
    },
  }),
  withStyles(styles),
)(FinancingSection);
