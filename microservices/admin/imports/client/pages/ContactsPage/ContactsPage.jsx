// @flow
import React from 'react';
import ContactsTable from './ContactsTable/ContactsTable';
import ContactsPageContainer from './ContactsPageContainer';

type ContactsPageProps = {
  contacts: Array<Object>,
};

const ContactsPage = ({ contacts }: ContactsPageProps) => (
  <div className="card1 card-top">
    <ContactsTable contacts={contacts} />
  </div>
);

export default ContactsPageContainer(ContactsPage);
