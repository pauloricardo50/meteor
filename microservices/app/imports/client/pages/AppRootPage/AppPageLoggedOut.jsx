import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { referralExists } from 'core/api/methods/methodDefinitions';
import {
  LOCAL_STORAGE_OLD_REFERRAL,
  LOCAL_STORAGE_REFERRAL,
} from 'core/api/users/userConstants';
import Loading from 'core/components/Loading';
import useSearchParams from 'core/hooks/useSearchParams';
import { createRoute } from 'core/utils/routerUtils';

import appRoutes from '../../../startup/client/appRoutes';
import useAnonymousLoan from '../../hooks/useAnonymousLoan';

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

const AppPageLoggedOut = () => {
  const searchParams = useSearchParams();
  const { anonymousLoan, loading } = useAnonymousLoan({
    updatedAt: 1,
    name: 1,
    borrowers: { updatedAt: 1 },
    properties: { name: 1, address1: 1, totalValue: 1 },
  });

  useEffect(() => {
    if (searchParams.ref) {
      setReferralId(searchParams.ref);
    }
  }, [searchParams.ref]);

  if (loading) {
    return <Loading />;
  }

  if (anonymousLoan) {
    if (searchParams['property-id']) {
      return (
        <Redirect
          to={createRoute(appRoutes.APP_PRO_PROPERTY_PAGE.path, {
            propertyId: searchParams['property-id'],
          })}
        />
      );
    }

    return (
      <Redirect
        to={createRoute(appRoutes.LOAN_ONBOARDING_PAGE.path, {
          loanId: anonymousLoan._id,
        })}
      />
    );
  }

  const search = new URLSearchParams(searchParams);
  search.delete('ref');
  const query = search.toString();

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
