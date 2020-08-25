import React from 'react';

import { CONTACT_TYPES, useLoanContacts } from 'core/hooks/useContacts';
import Calculator from 'core/utils/Calculator';

import RequestContact from '../../../components/RequestContact';

const SingleLoanPageContacts = ({ loan }) => {
  const { _id: loanId } = loan;
  const { loading, contacts } = useLoanContacts(loanId);
  let filteredContacts = contacts || [];

  const selectedOfferId = loan.structure?.offerId;

  if (selectedOfferId) {
    filteredContacts = filteredContacts.filter(({ email, type }) => {
      if (type !== CONTACT_TYPES.LENDER) {
        return true;
      }

      const lender = Calculator.selectLenderForOfferId({
        loan,
        offerId: selectedOfferId,
      });

      return lender?.contact?.email === email;
    });

    filteredContacts = filteredContacts.map(({ type, title, ...contact }) => ({
      ...contact,
      type,
      title: type === CONTACT_TYPES.LENDER ? 'Prêteur retenu' : title,
    }));
  }

  const showLoading = loading && !contacts;

  return (
    <div className="single-loan-page-contacts card1 card-top">
      <h3>Contacts</h3>

      <div className="scroll-wrapper">
        {!showLoading &&
          filteredContacts.map(contact => (
            <RequestContact
              {...contact}
              key={contact.name}
              className="single-loan-page-contacts-contact"
            />
          ))}
      </div>
      {!showLoading && filteredContacts.length === 0 && (
        <h2 className="secondary text-center">Pas de contacts</h2>
      )}
    </div>
  );
};

export default SingleLoanPageContacts;
