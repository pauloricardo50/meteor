import { branch, renderComponent, compose, withProps } from 'recompose';

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
);
