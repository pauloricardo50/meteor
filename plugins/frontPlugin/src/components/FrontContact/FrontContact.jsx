import React from 'react';

import FrontContactContainer from './FrontContactContainer';
import FrontContactHeader from './FrontContactHeader';
import ContactCard from './ContactCard';
import LoanCard from './FrontContactLoans/LoanCard';

const FrontContact = ({
  finalContact,
  conversation,
  loading,
  isEpotekResource,
  collection,
  refetch,
}) => {
  if (loading) {
    return (
      <div className="text-center">
        <i>Loading...</i>
      </div>
    );
  }

  return (
    <div className="front-contact">
      <FrontContactHeader
        contact={finalContact}
        isEpotekResource={isEpotekResource}
        collection={collection}
        refetch={refetch}
        conversation={conversation}
      />
      {isEpotekResource && (
        <ContactCard
          contact={finalContact}
          isEpotekResource={isEpotekResource}
          collection={collection}
          refetch={refetch}
        />
      )}

      {isEpotekResource &&
        collection === 'users' &&
        finalContact.loans?.length &&
        finalContact.loans.map(loan => (
          <LoanCard
            key={loan._id}
            loan={loan}
            expanded={finalContact.length === 1}
            refetch={refetch}
          />
        ))}
    </div>
  );
};

export default FrontContactContainer(FrontContact);
