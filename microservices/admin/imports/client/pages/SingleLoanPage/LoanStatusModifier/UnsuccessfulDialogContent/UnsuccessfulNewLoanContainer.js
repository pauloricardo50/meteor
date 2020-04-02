import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';

import { ACTIVITY_TYPES } from 'core/api/activities/activityConstants';
import { activityInsert } from 'core/api/activities/methodDefinitions';
import { LOAN_STATUS } from 'core/api/loans/loanConstants';
import {
  adminLoanInsert,
  loanSetCreatedAtActivityDescription,
  loanUpdate,
  reuseProperty,
} from 'core/api/loans/methodDefinitions';
import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';

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
    }),
  ),
);
