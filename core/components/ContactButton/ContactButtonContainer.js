import { compose } from 'recompose';

import { withSmartQuery } from '../../api/containerToolkit';
import { userImpersonatedSession } from '../../api/sessions/queries';
import SimpleContactButtonContainer from './SimpleContactButtonContainer';

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
