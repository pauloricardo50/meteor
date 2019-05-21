// @flow
import React from 'react';

import ClickToEditField from 'core/components/ClickToEditField';
import { loanUpdate } from 'core/api/loans/index';
import PremiumBadge from '../../../components/PremiumBadge/PremiumBadge';
import SingleLoanPageHeader from '../SingleLoanPageHeader';
import PremiumLoanTabs from './PremiumLoanTabs';

type PremiumSingleLoanPageProps = {};

const PremiumSingleLoanPage = (props: PremiumSingleLoanPageProps) => {
  const { loan } = props;
  return (
    <div className="single-loan-page premium">
      <PremiumBadge />
      <SingleLoanPageHeader
        loan={loan}
        withPdf={false}
        withCustomName={false}
      />
      <h3 className="secondary">
        <ClickToEditField
          value={loan.customName}
          onSubmit={value =>
            loanUpdate.run({ loanId: loan._id, object: { customName: value } })
          }
          placeholder="Ajouter un nom..."
        />
      </h3>
      <PremiumLoanTabs {...props} />
    </div>
  );
};

export default PremiumSingleLoanPage;
