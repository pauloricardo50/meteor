import { useEffect, useState } from 'react';

import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/loans/loanConstants';
import { anonymousLoan as anonymousLoanQuery } from 'core/api/loans/queries';
import useMeteorData from 'core/hooks/useMeteorData';

const useAnonymousLoan = fragment => {
  const [anonymousLoanId, setAnonymousLoanId] = useState(() =>
    localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN),
  );

  const { data: anonymousLoan, loading } = useMeteorData(
    {
      query: anonymousLoanId && anonymousLoanQuery,
      params: {
        _id: anonymousLoanId,
        $body: fragment,
      },
      type: 'single',
    },
    [anonymousLoanId],
  );

  useEffect(() => {
    if (anonymousLoanId && !loading && !anonymousLoan) {
      localStorage.removeItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
      setAnonymousLoanId(undefined);
    }
  }, [anonymousLoanId, anonymousLoan, loading]);

  return { anonymousLoan, loading };
};

export default useAnonymousLoan;
