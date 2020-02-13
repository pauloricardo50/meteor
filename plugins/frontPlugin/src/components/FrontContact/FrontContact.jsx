import React from 'react';

import FrontContactContainer from './FrontContactContainer';
import FrontContactHeader from './FrontContactHeader';
import ContactCard from './ContactCard';
import FrontContactLoans from './FrontContactLoans/FrontContactLoans';

const FrontContact = ({
  finalContact,
  conversation,
  loading,
  error,
  isEpotekResource,
  collection,
}) => {
  if (loading) {
    return (
      <div className="text-center">
        <i>Loading...</i>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return (
      <div className="text-center">
        <i>Error...</i>
      </div>
    );
  }

  return (
    <div className="front-contact">
      <FrontContactHeader
        contact={finalContact}
        isEpotekResource={isEpotekResource}
        collection={collection}
        conversation={conversation}
      />
      <ContactCard
        contact={finalContact}
        isEpotekResource={isEpotekResource}
        collection={collection}
      />

      {isEpotekResource && collection === 'users' && (
        <FrontContactLoans loans={finalContact.loans} />
      )}
    </div>
  );
};

export default FrontContactContainer(FrontContact);
