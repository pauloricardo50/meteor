import React from 'react';

import { useInsuranceRequestContacts } from 'core/hooks/useContacts';

import RequestContact from '../../components/RequestContact';

const SingleInsuranceRequestPageContacts = ({ insuranceRequestId }) => {
  const { loading, contacts } = useInsuranceRequestContacts(insuranceRequestId);
  return (
    <div className="single-insurance-request-page-contacts card1 card-top">
      <h3>Contacts</h3>

      <div className="scroll-wrapper">
        {!loading &&
          contacts.map(contact => (
            <RequestContact
              {...contact}
              key={contact.name}
              className="single-insurance-request-page-contacts-contact"
            />
          ))}
      </div>
      {!loading && contacts.length === 0 && (
        <h2 className="secondary text-center">Pas de contacts</h2>
      )}
    </div>
  );
};

export default SingleInsuranceRequestPageContacts;
