// @flow
import React from 'react';
import { withState } from 'recompose';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import { WelcomeScreen } from '../../../components/WelcomeScreen/WelcomeScreen';

type NoLoanStartProps = {};

const NoLoanStart = ({
  insertAnonymousLoan,
  loading,
  setLoading,
}: NoLoanStartProps) => (
  <WelcomeScreen
    displayCheckbox={false}
    handleClick={() => {
      setLoading(true);
      insertAnonymousLoan().finally(() => setLoading(false));
    }}
    buttonProps={{ loading }}
  />
);
export default withState('loading', 'setLoading', false)(NoLoanStart);
