// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/constants';

type AnonymousLoanRemoverProps = {};

const AnonymousLoanRemover = (props: AnonymousLoanRemoverProps) => {
  if (!Meteor.isDevelopment) {
    return null;
  }

  const loanId = localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);

  if (!loanId) {
    return null;
  }

  return (
    <button
      style={{ position: 'absolute', bottom: 0, right: 0, opacity: 0.5 }}
      type="button"
      onClick={() => localStorage.removeItem(LOCAL_STORAGE_ANONYMOUS_LOAN)}
    >
      Remove anon loan
    </button>
  );
};

export default AnonymousLoanRemover;
