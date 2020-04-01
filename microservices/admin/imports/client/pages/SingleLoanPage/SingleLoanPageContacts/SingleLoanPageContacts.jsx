import React from 'react';

import useLoanContacts from 'core/components/AdminNote/useLoanContacts';
import RequestContact from '../../../components/RequestContact';

const SingleLoanPageContacts = ({ loanId }) => {
  const { loading, contacts } = useLoanContacts(loanId);
  return (
    <div className="single-loan-page-contacts card1 card-top">
      <h3>Contacts</h3>

      <div className="scroll-wrapper">
        {!loading &&
          contacts.map(contact => (
            <RequestContact
              {...contact}
              key={contact.name}
              className="single-loan-page-contacts-contact"
            />
          ))}
      </div>
      {!loading && contacts.length === 0 && (
        <h2 className="secondary text-center">Pas de contacts</h2>
      )}
    </div>
  );
};

export default SingleLoanPageContacts;
