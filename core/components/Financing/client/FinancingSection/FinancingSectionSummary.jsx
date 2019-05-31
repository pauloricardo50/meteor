// @flow
import React, { PureComponent } from 'react';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

import FinancingLabels from '../FinancingLabels';
import { makeRenderSummary } from './financingSectionHelpers';

export default class FinancingSectionSummary extends PureComponent {
  constructor(props) {
    super(props);
    const { summaryConfig } = props;
    this.renderSummary = makeRenderSummary(summaryConfig);
  }

  render() {
    const {
      summaryConfig,
      sectionProps,
      noWrapper,
      content,
      expandedClass,
      ...rest
    } = this.props;
    const { structures } = sectionProps;

    return (
      <ExpansionPanelSummary
        className="section-summary"
        classes={{ content, expanded: expandedClass }}
        {...rest}
      >
        <FinancingLabels config={summaryConfig} className="summary-labels" />

        {structures.map(structure =>
          this.renderSummary(structure, sectionProps))}
      </ExpansionPanelSummary>
    );
  }
}

FinancingSectionSummary.muiName = ExpansionPanelSummary.muiName;
