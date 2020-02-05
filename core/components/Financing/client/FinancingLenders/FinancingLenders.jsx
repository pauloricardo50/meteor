//
import React from 'react';

import Button from '../../../Button';
import FinancingSection from '../FinancingSection';
import FinancingLendersHeader from './FinancingLendersHeader';
import LenderList from './LenderList';
import FinancingLendersContainer from './FinancingLendersContainer';

const FinancingLenders = ({ showAllLenders, setShowAllLenders, ...props }) => (
  <>
    <Button primary raised onClick={() => setShowAllLenders(!showAllLenders)}>
      {showAllLenders ? 'Prêteurs seulement' : 'Afficher tous'}
    </Button>
    <FinancingSection
      summaryConfig={[
        {
          id: 'lenders',
          label: <span className="section-title">Prêteurs</span>,
          Component: FinancingLendersHeader,
        },
      ]}
      detailConfig={[
        { id: 'lender-list', label: 'Prêteurs', Component: LenderList },
      ]}
      {...props}
    />
  </>
);

export default FinancingLendersContainer(FinancingLenders);
