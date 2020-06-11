import React from 'react';

import ContactCard from './ContactCard';
import FrontContactContainer from './FrontContactContainer';
import FrontContactHeader from './FrontContactHeader';
import LoanCard from './FrontContactLoans/LoanCard';

const mapLoans = ({ loans = [], conversation, refetch, tagIds, setTagIds }) => {
  if (!loans.length) {
    return null;
  }

  let sortedLoans = loans;
  let expandedLoan;
  const loanTagIds = tagIds.filter(tag =>
    loans.some(({ frontTagId }) => frontTagId === tag),
  );

  if (loanTagIds.length === 1) {
    expandedLoan = loans.find(loan => {
      const { frontTagId: loanTagId } = loan;
      return loanTagId === loanTagIds[0];
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
      tagIds={tagIds}
      setTagIds={setTagIds}
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
  tagIds,
  setTagIds,
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
        tagIds={tagIds}
        setTagIds={setTagIds}
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
        mapLoans({
          loans: finalContact?.loans,
          conversation,
          refetch,
          tagIds,
          setTagIds,
        })}
    </div>
  );
};

export default FrontContactContainer(FrontContact);
