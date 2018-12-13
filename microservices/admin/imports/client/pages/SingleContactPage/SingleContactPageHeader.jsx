// @flow
import React from 'react';
import ModifyContactFormDialog from '../ContactsPage/ContactDialogForm/ModifyContactFormDialog';
import OrganisationsPage from '../OrganisationsPage/OrganisationsPage';

type SingleContactPageHeaderProps = {
  contact: Object,
};

const SingleContactPageHeader = ({ contact }: SingleContactPageHeaderProps) => {
  const { name, organisations } = contact;
  console.log('contact', contact);
  return (
    <div className="single-contact-page-header">
      <span className="contact-name">
        <h1>{name}</h1>
        {organisations && organisations.length > 0 && (
          <h3 className="secondary">
            {' '}
            - {organisations.map(organisation => organisation.name).join(', ')}
          </h3>
        )}
      </span>
      <ModifyContactFormDialog contact={contact} />
    </div>
  );
};

export default SingleContactPageHeader;
