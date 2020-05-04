import React from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { LOAN_STATUS } from 'core/api/loans/loanConstants';
import Button from 'core/components/Button';
import { CollectionIconLink } from 'core/components/IconLink';
import DialogForm from 'core/components/ModalManager/DialogForm';
import T from 'core/components/Translation';

import LoanDisbursementDate from '../LoanTabs/OverviewTab/LoanDisbursementDate';
import RealRevenuesDialogContent from './RealRevenuesDialogContent';
import UnsuccessfulLoanRevenuesAndTasks from './UnsuccessfulDialogContent/UnsuccessfulLoanRevenuesAndTasks';
import UnsuccessfulNewLoan from './UnsuccessfulDialogContent/UnsuccessfulNewLoan';
import UnsucessfulFeedback from './UnsuccessfulDialogContent/UnsucessfulFeedback';

const requiresRevenueStatus = status =>
  [LOAN_STATUS.CLOSING, LOAN_STATUS.BILLING, LOAN_STATUS.FINALIZED].includes(
    status,
  );

const getTitle = status => (
  <span>
    Passage du dossier à&nbsp;&quot;
    <T id={`Forms.status.${status}`} />
    &quot;
  </span>
);

const closeButton = (reject, closeAll) => (
  <Button
    primary
    label={<T id="general.close" />}
    onClick={() => {
      reject();
      closeAll();
    }}
    key="close"
  />
);

const makeAdditionalActions = loan => openModal => (status, prevStatus) => {
  switch (status) {
    case LOAN_STATUS.ONGOING: {
      return new Promise((resolve, reject) => {
        if (loan.disbursementDate) {
          return resolve();
        }
        openModal({
          title: getTitle(status),
          description:
            'Veuillez entrer une date approximative pour le décaissement des fonds',
          content: ({ closeAll }) => (
            <LoanDisbursementDate
              loan={loan}
              onSubmit={() => {
                closeAll();
                resolve();
              }}
            />
          ),
          actions: ({ closeAll }) => closeButton(reject, closeAll),
          important: true,
        });
      });
    }
    case LOAN_STATUS.UNSUCCESSFUL: {
      return new Promise((resolve, reject) => {
        openModal([
          <DialogForm
            key="reason"
            schema={
              new SimpleSchema({
                reason: {
                  type: String,
                  optional: false,
                  uniforms: {
                    placeholder:
                      "Le client n'est pas solvable pour ce bien immobilier",
                  },
                },
              })
            }
            title={getTitle(status)}
            description="Entrez la raison du passage du dossier en sans suite"
            className="animated fadeIn"
            important
          >
            <div className="flex-row center">
              <p>Vous vous apprêtez à passer le dossier&nbsp;</p>
              <CollectionIconLink relatedDoc={loan} />
              <p>&nbsp;en sans suite.</p>
            </div>
          </DialogForm>,

          {
            title: getTitle(status),
            content: ({ closeModal, returnValue }) => (
              <UnsucessfulFeedback
                loan={loan}
                closeModal={closeModal}
                returnValue={returnValue}
              />
            ),
            actions: ({ closeAll }) => closeButton(reject, closeAll),
            important: true,
          },
          {
            title: getTitle(status),
            description:
              'Attention: ce dossier a des tâches actives et/ou des revenus !',
            content: ({ closeModal, returnValue }) => (
              <UnsuccessfulLoanRevenuesAndTasks
                loan={loan}
                closeModal={closeModal}
                returnValue={returnValue}
              />
            ),
            actions: ({ closeAll, closeModal, returnValue }) => [
              closeButton(reject, closeAll),
              <Button
                key="ok"
                primary
                raised
                label={<T id="general.ok" />}
                onClick={() => closeModal({ ...returnValue })}
              />,
            ],
            important: true,
            maxWidth: 'xl',
            fullWidth: true,
          },
          {
            title: getTitle(status),
            content: ({ closeModal, returnValue }) => (
              <UnsuccessfulNewLoan
                loan={loan}
                closeModal={closeModal}
                returnValue={returnValue}
                confirmNewStatus={() => resolve()}
                cancelNewStatus={reject}
              />
            ),
            actions: () => [],
            important: true,
          },
        ]);
      });
    }
    default:
      break;
  }

  if (!requiresRevenueStatus(prevStatus) && requiresRevenueStatus(status)) {
    return new Promise((resolve, reject) => {
      openModal({
        title: getTitle(status),
        content: ({ closeModal }) => (
          <RealRevenuesDialogContent
            loan={loan}
            closeModal={closeModal}
            confirmNewStatus={() => resolve()}
          />
        ),
        actions: ({ closeAll }) => [
          closeButton(reject, closeAll),
          <Button
            primary
            label={<T id="general.ok" />}
            onClick={() => {
              resolve();
              closeAll();
            }}
            key="ok"
          />,
        ],
      });
    });
  }

  return Promise.resolve();
};

export default withProps(({ loan }) => ({
  additionalActions: makeAdditionalActions(loan),
}));
