import {
  branch,
  renderComponent,
  compose,
  withProps,
  withState,
} from 'recompose';

import { userLoanInsert, referralExists } from 'core/api/methods/index';
import { LOCAL_STORAGE_REFERRAL } from 'core/api/constants';
import AnonymousAppPage from './AnonymousAppPage';
import PropertyStartPage from './PropertyStartPage';

export default compose(
  withProps(({ location }) => {
    if (!location.search) {
      return {};
    }

    const paramsQuery = new URLSearchParams(location.search);
    const propertyId = paramsQuery.get('propertyId');
    // Don't allow referralId to be null
    const referralId = paramsQuery.get('ref') || undefined;

    if (referralId) {
      return referralExists.run({ ref: referralId }).then((exists) => {
        if (exists) {
          localStorage.setItem(LOCAL_STORAGE_REFERRAL, referralId);
        }
        return {
          propertyId,
          referralId: exists ? referralId : undefined,
        };
      });
    }

    return { propertyId, referralId };
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
