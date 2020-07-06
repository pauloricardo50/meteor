import React from 'react';
import { compose } from 'recompose';

import { CONTACTS_COLLECTION } from 'core/api/contacts/contactsConstants';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { contact } from 'core/api/fragments';
import withMatchParam from 'core/containers/withMatchParam';

export default compose(
  withMatchParam('contactId'),
  Component => props => <Component {...props} key={props.contactId} />,
  withSmartQuery({
    query: CONTACTS_COLLECTION,
    params: ({ contactId }) => ({ $filters: { _id: contactId }, ...contact() }),
    queryOptions: { single: true },
    dataName: 'contact',
  }),
);
