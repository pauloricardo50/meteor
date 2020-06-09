import React from 'react';
import { withProps } from 'recompose';

import { LOAN_STATUS } from 'core/api/loans/loanConstants';
import { loanSetStatus } from 'core/api/loans/methodDefinitions';
import Button from 'core/components/Button';
import T from 'core/components/Translation';

import StatusModifier from '../../../components/StatusModifier';
import { CancelButton } from '../../../components/StatusModifier/StatusModifier';
import LoanDisbursementDate from '../LoanTabs/OverviewTab/LoanDisbursementDate';
import RealRevenuesDialogContent from './RealRevenuesDialogContent';
import UnsuccessfulDialogPipeline from './UnsuccessfulDialogContent/UnsucessfulDialogPipeline';

const requiresRevenueStatus = status =>
  [LOAN_STATUS.CLOSING, LOAN_STATUS.BILLING, LOAN_STATUS.FINALIZED].includes(
    status,
  );

export const additionalActionsConfig = {
  [LOAN_STATUS.ONGOING]: ({ resolve, doc: loan }) => ({
    bypass: loan?.disbursementDate,
    modals: [
      {
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
        important: true,
      },
    ],
  }),
  [LOAN_STATUS.UNSUCCESSFUL]: UnsuccessfulDialogPipeline,
  DEFAULT: ({ resolve, reject, doc: loan, status, prevStatus }) => ({
    bypass: requiresRevenueStatus(prevStatus) || !requiresRevenueStatus(status),
    modals: [
      {
        content: ({ closeModal }) => (
          <RealRevenuesDialogContent
            loan={loan}
            closeModal={closeModal}
            confirmNewStatus={() => resolve()}
          />
        ),
        actions: ({ closeAll }) => [
          <CancelButton closeAll={closeAll} reject={reject} key="close" />,
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
      },
    ],
  }),
};

const LoanStatusModifierContainer = withProps(({ loan }) => ({
  doc: loan,
  method: status => loanSetStatus.run({ loanId: loan._id, status }),
  additionalActionsConfig,
}));

export default LoanStatusModifierContainer(StatusModifier);
