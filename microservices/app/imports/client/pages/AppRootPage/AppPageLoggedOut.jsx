import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/loans/loanConstants';
import { anonymousLoan as anonymousLoanQuery } from 'core/api/loans/queries';
import { referralExists } from 'core/api/methods/methodDefinitions';
import {
  LOCAL_STORAGE_OLD_REFERRAL,
  LOCAL_STORAGE_REFERRAL,
} from 'core/api/users/userConstants';
import Loading from 'core/components/Loading';
import useMeteorData from 'core/hooks/useMeteorData';
import useSearchParams from 'core/hooks/useSearchParams';

import appRoutes from '../../../startup/client/appRoutes';

const setReferralId = referralId => {
  const oldReferralId =
    localStorage.getItem(LOCAL_STORAGE_OLD_REFERRAL) || undefined;

  if (referralId) {
    localStorage.setItem(LOCAL_STORAGE_REFERRAL, referralId);
  }

  if (oldReferralId) {
    localStorage.setItem(LOCAL_STORAGE_OLD_REFERRAL, oldReferralId);
  }

  if (referralId === oldReferralId) {
    return;
  }

  if (referralId) {
    referralExists.run({ refId: referralId }).then(exists => {
      if (exists) {
        localStorage.setItem(LOCAL_STORAGE_OLD_REFERRAL, referralId);
      } else if (oldReferralId) {
        localStorage.setItem(LOCAL_STORAGE_REFERRAL, oldReferralId);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_REFERRAL);
      }
    });
  }
};

const useAnonymousLoan = () => {
  const [anonymousLoanId, setAnonymousLoanId] = useState(() =>
    localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN),
  );
  const { data: anonymousLoan, loading } = useMeteorData(
    {
      query: anonymousLoanId && anonymousLoanQuery,
      params: {
        _id: anonymousLoanId,
        $body: {
          updatedAt: 1,
          name: 1,
          borrowers: { updatedAt: 1 },
          properties: { name: 1, address1: 1, totalValue: 1 },
          simpleBorrowersForm: 1,
        },
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

const AppPageLoggedOut = () => {
  const searchParams = useSearchParams();
  const { anonymousLoan, loading } = useAnonymousLoan();

  useEffect(() => {
    if (searchParams.ref) {
      setReferralId(searchParams.ref);
    }
  }, [searchParams.ref]);

  if (loading) {
    return <Loading />;
  }

  if (searchParams['property-id']) {
    return null;
  }

  if (searchParams['promotion-id']) {
    // TODO: Do this
    return null;
  }

  if (anonymousLoan) {
    return <Redirect to={`/loans/${anonymousLoan._id}`} />;
  }

  let query;
  if (searchParams.purchaseType) {
    const search = new URLSearchParams();
    search.append('purchaseType', searchParams.purchaseType);
    query = search.toString;
  }

  return (
    <Redirect
      to={
        query
          ? `${appRoutes.ONBOARDING_PAGE.path}?${query}`
          : appRoutes.ONBOARDING_PAGE.path
      }
    />
  );
};

export default AppPageLoggedOut;
