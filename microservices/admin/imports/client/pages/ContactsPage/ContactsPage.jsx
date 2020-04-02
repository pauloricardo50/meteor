import React from 'react';
import { Helmet } from 'react-helmet';

import { CONTACTS_COLLECTION } from 'core/api/contacts/contactsConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import Icon from 'core/components/Icon/Icon';

import ContactsPageContainer from './ContactsPageContainer';
import ContactsTable from './ContactsTable/ContactsTable';

const ContactsPage = ({ contacts }) => (
  <div className="contacts-page">
    <Helmet>
      <title>Contacts</title>
    </Helmet>
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
