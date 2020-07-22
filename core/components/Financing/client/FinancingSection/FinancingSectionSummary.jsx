import React, { PureComponent } from 'react';
import AccordionSummary from '@material-ui/core/AccordionSummary';

import FinancingLabels from '../FinancingLabels';
import { makeRenderSummary } from './financingSectionHelpers';

const SummaryContent = React.memo(
  ({ structures, summaryConfig, sectionProps, renderSummary }) => (
    <>
      <FinancingLabels config={summaryConfig} className="summary-labels" />
      {structures.map(structure => renderSummary(structure, sectionProps))}
    </>
  ),
);

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
      content,
      expandedClass,
      summaryRoot,
      ...rest
    } = this.props;
    const { structures } = sectionProps;

    return (
      <AccordionSummary
        className="section-summary"
        classes={{ content, expanded: expandedClass, root: summaryRoot }}
        {...rest}
      >
        <SummaryContent
          structures={structures}
          summaryConfig={summaryConfig}
          sectionProps={sectionProps}
          renderSummary={this.renderSummary}
        />
      </AccordionSummary>
    );
  }
}

FinancingSectionSummary.muiName = AccordionSummary.muiName;
