// @flow
import React from 'react';

import FinancingSection from '../FinancingSection';
import FinancingLendersHeader from './FinancingLendersHeader';
import LenderList from './LenderList';
import FinancingLendersContainer from './FinancingLendersContainer';

type FinancingLendersProps = {};

const FinancingLenders = (props: FinancingLendersProps) => (
  <FinancingSection
    summaryConfig={[
      {
        id: 'lenders',
        label: <span className="section-title">PRÊTEURS</span>,
        Component: FinancingLendersHeader,
      },
    ]}
    detailConfig={[
      { id: 'lender-list', label: 'Prêteurs', Component: LenderList },
    ]}
    {...props}
  />
);

export default FinancingLendersContainer(FinancingLenders);
