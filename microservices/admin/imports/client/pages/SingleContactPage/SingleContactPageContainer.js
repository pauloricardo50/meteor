import { compose } from 'recompose';

import { adminContacts as query } from 'core/api/contacts/queries';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import withMatchParam from 'core/containers/withMatchParam';

export default compose(
  withMatchParam('contactId'),
  withSmartQuery({
    query,
    params: ({ contactId }) => ({ _id: contactId }),
    queryOptions: { single: true, reactive: false },
    dataName: 'contact',
  }),
);
