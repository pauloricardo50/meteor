// @flow
import React from 'react';


import PremiumBadge from '../../../components/PremiumBadge/PremiumBadge';
import SingleLoanPageHeader from '../SingleLoanPageHeader';
import PremiumLoanTabs from './PremiumLoanTabs';
import SingleLoanPageTasks from '../SingleLoanPageTasks';
import SingleLoanPageCustomName from '../SingleLoanPageCustomName';

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
      <SingleLoanPageCustomName
        customName={loan.customName}
        loanId={loan._id}
      />
      <SingleLoanPageTasks loan={loan} />
      <PremiumLoanTabs {...props} />
    </div>
  );
};

export default PremiumSingleLoanPage;
