import {
  branch,
  compose,
  renderComponent,
  withProps,
  withState,
} from 'recompose';

import { userLoanInsert } from 'core/api/loans/methodDefinitions';
import { referralExists } from 'core/api/methods/methodDefinitions';
import {
  LOCAL_STORAGE_OLD_REFERRAL,
  LOCAL_STORAGE_REFERRAL,
} from 'core/api/users/userConstants';

import AnonymousAppPage from './AnonymousAppPage';
import PropertyStartPage from './PropertyStartPage';

const setReferralId = paramsQuery => {
  const referralId = paramsQuery.get('ref') || undefined;
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

export default compose(
  withProps(({ location }) => {
    if (!location.search) {
      return {};
    }

    const paramsQuery = new URLSearchParams(location.search);
    const propertyId = paramsQuery.get('property-id');
    setReferralId(paramsQuery);

    return { propertyId };
  }),
  branch(({ propertyId }) => !!propertyId, renderComponent(PropertyStartPage)),
  branch(({ currentUser }) => !currentUser, renderComponent(AnonymousAppPage)),
  withState('loading', 'setLoading', false),
  withProps(({ setLoading }) => ({
    insertLoan: ({ test } = {}) => {
      setLoading(true);
      // Don't unset loading, as the page will refresh anyways to head to the new loan
      // reactively
      return userLoanInsert.run({ test }).catch(() => setLoading(false));
    },
  })),
);
