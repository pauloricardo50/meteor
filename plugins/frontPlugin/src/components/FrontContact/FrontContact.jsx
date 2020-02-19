import React from 'react';

import FrontContactContainer from './FrontContactContainer';
import FrontContactHeader from './FrontContactHeader';
import ContactCard from './ContactCard';
import LoanCard from './FrontContactLoans/LoanCard';
import { getLoanTag } from './FrontContactLoans/LoanTagger';

const mapLoans = ({ loans = [], conversation, refetch }) => {
  if (!loans.length) {
    return null;
  }

  let sortedLoans = loans;
  let expandedLoan;
  const { tags = [] } = conversation;
  const loanTags = tags.filter(tag => tag.includes('loan'));

  if (loanTags.length === 1) {
    expandedLoan = loans.find(loan => {
      const loanTag = getLoanTag(loan);
      return loanTag === loanTags[0];
    });
    sortedLoans = expandedLoan
      ? [
          expandedLoan,
          ...sortedLoans.filter(loan => loan._id !== expandedLoan._id),
        ]
      : sortedLoans;
  }

  return sortedLoans.map(loan => (
    <LoanCard
      key={loan._id}
      loan={loan}
      expanded={
        sortedLoans.length === 1 ? true : loan._id === expandedLoan?._id
      }
      refetch={refetch}
      conversation={conversation}
    />
  ));
};

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
        mapLoans({ loans: finalContact?.loans, conversation, refetch })}
    </div>
  );
};

export default FrontContactContainer(FrontContact);
