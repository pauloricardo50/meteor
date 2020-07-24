import React, { useEffect, useState } from 'react';

import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import useSearchParams from 'core/hooks/useSearchParams';

import { WelcomeScreen } from '../../../components/WelcomeScreen/WelcomeScreen';
import WelcomeScreenCtas from '../../../components/WelcomeScreen/WelcomeScreenCtas';

const NoLoanStart = ({ insertAnonymousLoan }) => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const addLoan = ({ purchaseType }) => {
    setLoading(true);
    insertAnonymousLoan({ purchaseType }).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (
      searchParams.purchaseType &&
      Object.values(PURCHASE_TYPE).includes(searchParams.purchaseType)
    ) {
      addLoan({ purchaseType: searchParams.purchaseType });
    }
  }, []);

  return (
    <WelcomeScreen
      displayCheckbox={false}
      cta={<WelcomeScreenCtas loading={loading} insertLoan={addLoan} />}
    />
  );
};

export default NoLoanStart;
