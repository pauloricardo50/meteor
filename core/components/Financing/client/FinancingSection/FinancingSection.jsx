// @flow
import React from 'react';

import { ScrollSyncPane } from 'react-scroll-sync';

import FinancingDataContainer from '../containers/FinancingDataContainer';
import FinancingSectionExpansionPanel from './FinancingSectionExpansionPanel';

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

const FinancingSection = ({
  detailConfig,
  noWrapper,
  summaryConfig,
  className,
  sectionItemProps,
  ...sectionProps
}: FinancingSectionProps) => (
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
