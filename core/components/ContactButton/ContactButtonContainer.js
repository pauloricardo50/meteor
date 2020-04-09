import { compose, withProps } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { userImpersonatedSession } from 'core/api/sessions/queries';

import SimpleContactButtonContainer from './SimpleContactButtonContainer'

const withImpersonatedSession = withSmartQuery({
  query: userImpersonatedSession,
  queryOptions: { reactive: true, single: true },
  dataName: 'impersonatedSession',
  renderMissingDoc: false,
});

const ContactButtonContainer = compose(
  withImpersonatedSession,
  SimpleContactButtonContainer,
);

export default ContactButtonContainer;
