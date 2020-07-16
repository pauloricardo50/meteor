import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import { compose, lifecycle, withState } from 'recompose';

import ClientEventService from '../../../../api/events/ClientEventService';
import FinancingSectionDetails from './FinancingSectionDetails';
import FinancingSectionSummary from './FinancingSectionSummary';

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
  summaryRoot: {
    minHeight: 32,
  },
  expanded: {},
};

const FinancingSectionExpansionPanel = ({
  detailConfig,
  summaryConfig,
  classes: {
    container,
    entered,
    content,
    expanded: expandedClass,
    summaryRoot,
  },
  className,
  expanded,
  changeExpanded,
  sectionProps,
  sectionItemProps,
}) => (
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
      summaryRoot={summaryRoot}
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
    ({ sectionProps: { Calculator, loan } }) => {
      const hasCompleteStructure = Calculator.hasCompleteStructure({ loan });
      return !hasCompleteStructure;
    },
  ),
  lifecycle({
    componentDidMount() {
      const { changeExpanded } = this.props;
      ClientEventService.addListener('expandAll', () => changeExpanded(true));
      ClientEventService.addListener('collapseAll', () =>
        changeExpanded(false),
      );
    },
    componentWillUnmount() {
      const { changeExpanded } = this.props;
      ClientEventService.removeListener('expandAll', () =>
        changeExpanded(true),
      );
      ClientEventService.removeListener('collapseAll', () =>
        changeExpanded(false),
      );
    },
  }),
  withStyles(styles),
)(FinancingSectionExpansionPanel);
