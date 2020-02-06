import React from 'react';
import { Helmet } from 'react-helmet';

import ModifyContactFormDialog from '../ContactsPage/ContactDialogForm/ModifyContactFormDialog';

const SingleContactPageHeader = ({ contact }) => {
  const { name, organisations = [] } = contact;
  return (
    <div className="single-contact-page-header">
      <Helmet>
        <title>{name}</title>
      </Helmet>
      <h1 className="space-children">
        <span>{name}</span>
        <small className="secondary">
          {organisations.map(organisation => organisation.name).join(', ')}
        </small>
      </h1>
      <ModifyContactFormDialog contact={contact} />
    </div>
  );
};

export default SingleContactPageHeader;
