import { compose } from 'recompose';

import withMatchParam from 'core/containers/withMatchParam';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { adminContacts as query } from 'core/api/contacts/queries';

export default compose(
  withMatchParam('contactId'),
  withSmartQuery({
    query,
    params: ({ contactId }) => ({ _id: contactId }),
    queryOptions: { single: true, reactive: false },
    dataName: 'contact',
  }),
);
