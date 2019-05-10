import {
  branch,
  renderComponent,
  compose,
  withProps,
  withState,
} from 'recompose';

import { userLoanInsert } from 'core/api/methods/index';
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
    const referralId = paramsQuery.get('refId') || undefined;

    return { propertyId, referralId };
  }),
  branch(({ propertyId }) => !!propertyId, renderComponent(PropertyStartPage)),
  branch(({ currentUser }) => !currentUser, renderComponent(AnonymousAppPage)),
  withState('loading', 'setLoading', false),
  withProps(({ setLoading }) => ({
    insertLoan: () => {
      setLoading(true);
      // Don't unset loading, as the page will refresh anyways to head to the new loan
      // reactively
      userLoanInsert.run().catch(() => setLoading(false));
    },
  })),
);
