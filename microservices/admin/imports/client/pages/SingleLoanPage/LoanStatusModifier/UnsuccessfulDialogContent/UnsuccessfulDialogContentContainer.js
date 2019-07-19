import { withProps, compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import uniqBy from 'lodash/uniqBy';

import {
  sendNegativeFeedbackToAllLenders,
  adminLoanInsert,
  reuseProperty,
  loanUpdate,
} from 'core/api';
import { LOAN_STATUS } from 'imports/core/api/constants';
import { PROPERTY_CATEGORY } from 'core/api/constants';

const makeSendFeedbackToAllLenders = (loan, promise) => () => {
  const { _id: loanId, offers = [] } = loan;

  // Don't show duplicate lenders
  const contacts = uniqBy(
    offers,
    ({
      lender: {
        contact: { name },
      },
    }) => name,
  ).map(({
    lender: {
      contact: { name },
      organisation: { name: organisationName },
    },
  }) => `${name} (${organisationName})`);

  if (offers.length) {
    const confirm = window.confirm(`Attention: enverra un feedback aux prêteurs suivants:\n\n${contacts.join('\n')}\n\nValider pour envoyer les feedbacks.`);

    if (confirm) {
      return sendNegativeFeedbackToAllLenders
        .run({ loanId })
        .then(() => promise.resolve)
        .catch(promise.reject);
    }
  }

  return promise.resolve();
};

const insertNewLoan = ({ loan, status = LOAN_STATUS.LEAD, promise }) => {
  const { properties = [], borrowers = [], userId } = loan;

  const userProperties = properties.filter(({ category }) => category === PROPERTY_CATEGORY.USER);
  const borrowerIds = borrowers.map(({ _id }) => _id);

  return adminLoanInsert
    .run({ userId })
    .then(loanId =>
      loanUpdate.run({ loanId, object: { status } }).then(() => loanId))
    .then((loanId) => {
      if (userProperties.length) {
        const promises = userProperties.map(({ _id: propertyId }) =>
          reuseProperty.run({ loanId, propertyId }));

        return Promise.all(promises).then(() => loanId);
      }

      return loanId;
    })
    .then((loanId) => {
      if (borrowerIds.length) {
        return loanUpdate
          .run({ loanId, object: { borrowerIds } })
          .then(() => loanId);
      }

      return loanId;
    })
    .then((loanId) => {
      promise.resolve();
      return loanId;
    });
};

export default compose(
  withRouter,
  withProps(({ loan, promise, setOpenDialog, history }) => ({
    sendFeedbackToAllLenders: makeSendFeedbackToAllLenders(loan, promise),
    setUnsuccessfulOnly: () => {
      promise.resolve();
      setOpenDialog(false);
    },
    insertLeadLoan: () => {
      insertNewLoan({ loan, promise })
        .then((loanId) => {
          history.push(`/loans/${loanId}`);
        })
        .catch(promise.reject);
    },
    insertPendingLoan: () => {
      insertNewLoan({ loan, status: LOAN_STATUS.PENDING, promise })
        .then((loanId) => {
          history.push(`/loans/${loanId}`);
        })
        .catch(promise.reject);
    },
    shouldDisplayFeedbackButton: loan.offers && !!loan.offers.length,
  })),
);
