import React from 'react';
import { compose, withStateHandlers, withProps } from 'recompose';
import { LOAN_STATUS } from 'core/api/constants';
import T from 'core/components/Translation';
import Button from 'core/components/Button';
import DialogForm from 'core/components/ModalManager/DialogForm';
import SimpleSchema from 'simpl-schema';
import RealRevenuesDialogContent from './RealRevenuesDialogContent';
import UnsucessfulFeedback from './UnsuccessfulDialogContent/UnsucessfulFeedback';
import UnsuccessfulNewLoan from './UnsuccessfulDialogContent/UnsuccessfulNewLoan';

const requiresRevenueStatus = status =>
  [LOAN_STATUS.CLOSING, LOAN_STATUS.BILLING, LOAN_STATUS.FINALIZED].includes(status);

const getTitle = status => (
  <span>
    Passage du dossier à&nbsp;&quot;
    <T id={`Forms.status.${status}`} />
    &quot;
  </span>
);

const makeAdditionalActions = ({ loan, setState }) => openModal => (
  status,
  prevStatus,
) => {
  switch (status) {
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
        />,

        {
          title: getTitle(status),
          content: ({ closeModal, returnValue, closeAll }) => (
            <UnsucessfulFeedback
              loan={loan}
              closeModal={closeModal}
              returnValue={returnValue}
            />
          ),
          actions: ({ closeAll }) => (
            <Button
              primary
              label={<T id="general.close" />}
              onClick={() => {
                reject();
                closeAll();
              }}
              key="close"
            />
          ),
          important: true,
        },
        {
          title: getTitle(status),
          content: ({ closeModal, returnValue, closeAll }) => (
            <UnsuccessfulNewLoan
              loan={loan}
              closeModal={closeModal}
              returnValue={returnValue}
              confirmNewStatus={() => resolve()}
              cancelNewStatus={reject}
            />
          ),
          actions: ({ closeAll }) => (
            <Button
              primary
              label={<T id="general.close" />}
              onClick={() => {
                reject();
                closeAll();
              }}
              key="close"
            />
          ),
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
      setState({
        cancelNewStatus: reject,
        confirmNewStatus: () => resolve(),
        dialogContent: (
          <RealRevenuesDialogContent
            loan={loan}
            setOpenDialog={open => setState({ openDialog: open })}
            cancelNewStatus={reject}
            confirmNewStatus={() => resolve()}
          />
        ),
        openDialog: true,
        withConfirmButton: true,
      });
    });
  }

  return Promise.resolve();
};

export default compose(
  withStateHandlers(
    {
      openDialog: false,
      dialogContent: null,
      title: '',
      withConfirmButton: false,
      cancelNewStatus: () => ({}),
      confirmNewStatus: () => ({}),
    },
    { setState: () => newState => newState },
  ),

  withProps(({ loan, setState }) => ({
    additionalActions: makeAdditionalActions({
      loan,
      setState,
    }),
    setOpenDialog: open => setState({ openDialog: open }),
  })),
);
