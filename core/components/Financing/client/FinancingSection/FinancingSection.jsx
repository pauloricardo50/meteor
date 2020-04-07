import React from 'react';
import { ScrollSyncPane } from 'react-scroll-sync';

import FinancingDataContainer from '../containers/FinancingDataContainer';
import FinancingSectionExpansionPanel from './FinancingSectionExpansionPanel';

const FinancingSection = ({
  detailConfig,
  noWrapper,
  summaryConfig,
  className,
  sectionItemProps,
  ...sectionProps
}) => (
  <ScrollSyncPane>
    <FinancingSectionExpansionPanel
      noWrapper={noWrapper}
      sectionProps={sectionProps}
      summaryConfig={summaryConfig}
      detailConfig={detailConfig}
      className={className}
      sectionItemProps={sectionItemProps}
    />
  </ScrollSyncPane>
);

export default FinancingDataContainer(FinancingSection);
