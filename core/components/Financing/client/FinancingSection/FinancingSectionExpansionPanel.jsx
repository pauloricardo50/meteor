// @flow
import React from 'react';
import { compose, withState, lifecycle } from 'recompose';
import cx from 'classnames';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { withStyles } from '@material-ui/core/styles';

import ClientEventService from '../../../../api/events/ClientEventService';
import FinancingSectionSummary from './FinancingSectionSummary';
import FinancingSectionDetails from './FinancingSectionDetails';

type FinancingSectionExpansionPanelProps = {};

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

const FinancingSectionExpansionPanel = ({
  detailConfig,
  summaryConfig,
  classes: { container, entered, content, expanded: expandedClass },
  className,
  expanded,
  changeExpanded,
  sectionProps,
  sectionItemProps,
}: FinancingSectionExpansionPanelProps) => (
  <ExpansionPanel
    className={cx('financing-structures-section', className, { expanded })}
    CollapseProps={{ classes: { container, entered } }}
    expanded={expanded}
    onChange={() => changeExpanded(!expanded)}
  >
    <FinancingSectionSummary
      summaryConfig={summaryConfig}
      sectionProps={sectionProps}
      content={content}
      expandedClass={expandedClass}
    />
    <FinancingSectionDetails
      detailConfig={detailConfig}
      sectionProps={sectionProps}
      sectionItemProps={sectionItemProps}
    />
  </ExpansionPanel>
);

export default compose(
  withState(
    'expanded',
    'changeExpanded',
    ({ sectionProps: { Calculator, loan } }) =>
      !Calculator.hasCompleteStructure({ loan }),
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
)(FinancingSectionExpansionPanel);
