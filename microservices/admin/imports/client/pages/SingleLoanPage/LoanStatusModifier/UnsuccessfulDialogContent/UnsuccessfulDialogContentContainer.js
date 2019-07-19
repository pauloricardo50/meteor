import { withProps, compose, withState } from 'recompose';
import { withRouter } from 'react-router-dom';
import uniqBy from 'lodash/uniqBy';

import {
  sendNegativeFeedbackToAllLenders,
  adminLoanInsert,
  reuseProperty,
  loanUpdate,
  loanSetCreatedAtActivityDescription,
} from 'core/api';
import { LOAN_STATUS } from 'imports/core/api/constants';
import { PROPERTY_CATEGORY } from 'core/api/constants';
import { activityInsert } from 'core/api/activities/methodDefinitions';
import { ACTIVITY_TYPES } from 'core/api/activities/activityConstants';

const makeSendFeedbackToAllLenders = (
  loan,
  cancelNewStatus,
  confirmNewStatus,
  setEnableFeedbackButton,
) => () => {
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
        .then(() => {
          setEnableFeedbackButton(false);
          import('core/utils/message').then(({ default: message }) => {
            message.success("C'est dans la boite !", 2);
          });
        })
        .then(() => confirmNewStatus())
        .catch(cancelNewStatus);
    }
  }

  return confirmNewStatus();
};

const insertNewLoan = ({
  loan,
  status = LOAN_STATUS.LEAD,
  cancelNewStatus,
  confirmNewStatus,
}) => {
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
    .then(loanId =>
      loanSetCreatedAtActivityDescription.run({
        loanId,
        description: `Après avoir passé dossier ${loan.name} en sans suite`,
      }))
    .then((loanId) => {
      confirmNewStatus();
      return loanId;
    });
};

const addUnsuccesfulActivity = ({ loanId, reason }) =>
  activityInsert.run({
    object: {
      title: 'Sans suite',
      description: reason,
      type: ACTIVITY_TYPES.SERVER,
      loanLink: { _id: loanId },
    },
  });

export default compose(
  withRouter,
  withState('enableFeedbackButton', 'setEnableFeedbackButton', true),
  withState('reason', 'setReason', ''),
  withProps(({
    loan,
    cancelNewStatus,
    confirmNewStatus,
    setOpenDialog,
    history,
    setEnableFeedbackButton,
    reason,
  }) => ({
    sendFeedbackToAllLenders: makeSendFeedbackToAllLenders(
      loan,
      cancelNewStatus,
      confirmNewStatus,
      setEnableFeedbackButton,
    ),
    setUnsuccessfulOnly: () => {
      addUnsuccesfulActivity({ loanId: loan._id, reason })
        .then(() => {
          confirmNewStatus();
          setOpenDialog(false);
        })
        .catch(cancelNewStatus);
    },
    insertLeadLoan: () => {
      addUnsuccesfulActivity({ loanId: loan._id, reason })
        .then(() =>
          insertNewLoan({ loan, cancelNewStatus, confirmNewStatus }))
        .then((loanId) => {
          history.push(`/loans/${loanId}`);
        })
        .catch(cancelNewStatus);
    },
    insertPendingLoan: () => {
      addUnsuccesfulActivity({ loanId: loan._id, reason })
        .then(() =>
          insertNewLoan({
            loan,
            status: LOAN_STATUS.PENDING,
            cancelNewStatus,
            confirmNewStatus,
          }))
        .then((loanId) => {
          history.push(`/loans/${loanId}`);
        })
        .catch(cancelNewStatus);
    },
    shouldDisplayFeedbackButton: loan.offers && !!loan.offers.length,
  })),
);
