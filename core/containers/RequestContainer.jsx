import React from 'react';

/* eslint-disable */
const RequestContainer = WrappedComponent => props => {
  const { loanRequests, borrowers, properties, offers, ...rest } = props;

  // match has to be passed to children
  const { requestId } = props.match.params;

  let loanRequest = {};
  let requestBorrowers = [];
  let requestOffers = [];
  let requestProperty = {};

  if (requestId) {
    loanRequest =
      loanRequests && loanRequests.find(request => request._id === requestId);
    requestBorrowers =
      loanRequest &&
      loanRequest.borrowers.map(borrowerId =>
        borrowers.find(borrower => borrower._id === borrowerId),
      );
    requestOffers =
      offers && offers.filter(offer => offer.requestId === requestId);
    requestProperty =
      properties &&
      properties.find(property => {
        // Add this check while transitioning from nested to separate property
        if (typeof loanRequest.property === 'string') {
          return property._id === loanRequest.property;
        }

        return false;
      });
  }

  return (
    <WrappedComponent
      loanRequest={loanRequest}
      borrowers={requestBorrowers}
      offers={requestOffers}
      property={requestProperty}
      {...rest}
    />
  );
};

export default RequestContainer;
