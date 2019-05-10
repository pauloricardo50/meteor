// @flow
import React from 'react';
import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/constants';

let AnonymousLoanRemover;

if (process.env.NODE_ENV !== 'production') {
  AnonymousLoanRemover = () => {
    const loanId = localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);

    if (!loanId) {
      return null;
    }

    return (
      <button
        style={{ position: 'absolute', bottom: 0, right: 0, opacity: 0.5 }}
        type="button"
        onClick={() => {
          localStorage.removeItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
          // Reload page for react to know about new localStorage
          window.location.reload();
        }}
      >
        Remove anon loan
      </button>
    );
  };
}

AnonymousLoanRemover = () => null;

export default AnonymousLoanRemover;
