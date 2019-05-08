// @flow
import React from 'react';
import { withState } from 'recompose';

import Button from 'core/components/Button';
import T from 'core/components/Translation';

type NoLoanStartProps = {};

const NoLoanStart = ({
  insertAnonymousLoan,
  loading,
  setLoading,
}: NoLoanStartProps) => (
  <div className="card1 card-top">
    <Button
      secondary
      raised
      onClick={() => {
        setLoading(true);
        insertAnonymousLoan().finally(() => setLoading(false));
      }}
      loading={loading}
    >
      <T id="AnonymousAppPage.start" />
    </Button>
  </div>
);

export default withState('loading', 'setLoading', false)(NoLoanStart);
