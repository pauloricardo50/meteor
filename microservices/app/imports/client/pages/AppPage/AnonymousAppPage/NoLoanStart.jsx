import React from 'react';
import { withState } from 'recompose';

import { WelcomeScreen } from '../../../components/WelcomeScreen/WelcomeScreen';
import WelcomeScreenCtas from '../../../components/WelcomeScreen/WelcomeScreenCtas';

const NoLoanStart = ({ insertAnonymousLoan, loading, setLoading }) => {
  const addLoan = ({ purchaseType }) => {
    setLoading(true);
    insertAnonymousLoan({ purchaseType }).finally(() => setLoading(false));
  };

  return (
    <WelcomeScreen
      displayCheckbox={false}
      cta={<WelcomeScreenCtas loading={loading} insertLoan={addLoan} />}
    />
  );
};

export default withState('loading', 'setLoading', false)(NoLoanStart);
