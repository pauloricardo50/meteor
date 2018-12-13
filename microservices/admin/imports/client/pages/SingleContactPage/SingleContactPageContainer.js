import { compose } from 'recompose';

import withMatchParam from 'core/containers/withMatchParam';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import singleContact from 'core/api/contacts/queries/singleContact';

export default compose(
  withMatchParam('contactId'),
  withSmartQuery({
    query: singleContact,
    params: ({ contactId }) => ({ contactId }),
    queryOptions: { single: true, reactive: false },
    dataName: 'contact',
  }),
);
