import { withProps, compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import {
  adminLoanInsert,
  reuseProperty,
  loanUpdate,
  loanSetCreatedAtActivityDescription,
} from 'core/api';
import { LOAN_STATUS } from 'imports/core/api/constants';
import { PROPERTY_CATEGORY } from 'core/api/constants';
import { activityInsert } from 'core/api/activities/methodDefinitions';
import { ACTIVITY_TYPES } from 'core/api/activities/activityConstants';

const insertNewLoan = ({
  loan,
  status = LOAN_STATUS.LEAD,
  confirmNewStatus,
}) => {
  const {
    properties = [],
    borrowers = [],
    user: { _id: userId },
  } = loan;

  const userProperties = properties.filter(
    ({ category }) => category === PROPERTY_CATEGORY.USER,
  );
  const borrowerIds = borrowers.map(({ _id }) => _id);

  return adminLoanInsert
    .run({ userId })
    .then(loanId =>
      loanUpdate.run({ loanId, object: { status } }).then(() => loanId),
    )
    .then(loanId => {
      if (userProperties.length) {
        const promises = userProperties.map(({ _id: propertyId }) =>
          reuseProperty.run({ loanId, propertyId }),
        );

        return Promise.all(promises).then(() => loanId);
      }

      return loanId;
    })
    .then(loanId => {
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
      }),
    )
    .then(loanId => {
      confirmNewStatus();
      return loanId;
    });
};

const addUnsuccesfulActivity = ({ loanId, reason }) =>
  activityInsert.run({
    object: {
      title: 'Sans suite',
      description: reason,
      type: ACTIVITY_TYPES.EVENT,
      isServerGenerated: true,
      loanLink: { _id: loanId },
    },
  });

export default compose(
  withRouter,
  withProps(
    ({
      loan,
      cancelNewStatus,
      confirmNewStatus,
      closeModal,
      history,
      returnValue: { reason },
    }) => ({
      setUnsuccessfulOnly: () => {
        addUnsuccesfulActivity({ loanId: loan._id, reason })
          .then(() => {
            confirmNewStatus();
            closeModal();
          })
          .catch(cancelNewStatus);
      },
      insertLeadLoan: () => {
        addUnsuccesfulActivity({ loanId: loan._id, reason })
          .then(() =>
            insertNewLoan({ loan, cancelNewStatus, confirmNewStatus }),
          )
          .then(loanId => {
            history.push(`/loans/${loanId}`);
          })
          .then(() => closeModal())
          .catch(cancelNewStatus);
      },
      insertQualifiedLeadLoan: () => {
        addUnsuccesfulActivity({ loanId: loan._id, reason })
          .then(() =>
            insertNewLoan({
              loan,
              cancelNewStatus,
              confirmNewStatus,
              status: LOAN_STATUS.QUALIFIED_LEAD,
            }),
          )
          .then(loanId => {
            history.push(`/loans/${loanId}`);
          })
          .then(() => closeModal())
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
            }),
          )
          .then(loanId => {
            history.push(`/loans/${loanId}`);
          })
          .then(() => closeModal())
          .catch(cancelNewStatus);
      },
    }),
  ),
);
