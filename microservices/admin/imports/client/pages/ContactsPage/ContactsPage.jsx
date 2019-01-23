// @flow
import React from 'react';

import Icon from 'core/components/Icon/Icon';
import collectionIcons from 'core/arrays/collectionIcons';
import { CONTACTS_COLLECTION } from 'core/api/constants';
import ContactsPageContainer from './ContactsPageContainer';
import ContactsTable from './ContactsTable/ContactsTable';

type ContactsPageProps = {
  contacts: Array<Object>,
};

const ContactsPage = ({ contacts }: ContactsPageProps) => (
  <div className="card1 card-top">
    <h1 className="flex center-align">
      <Icon
        type={collectionIcons[CONTACTS_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      <span>Contacts</span>
    </h1>
    <ContactsTable contacts={contacts} />
  </div>
);

export default ContactsPageContainer(ContactsPage);
