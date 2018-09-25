import React from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import loansAssignedToAdmin from 'core/api/loans/queries/loansAssignedToAdmin';
import T, { Money } from 'core/components/Translation';
import { LoanChecklistDialog } from 'core/components/LoanChecklist';
import withLoansDocuments from 'core/api/files/withLoansDocuments';
import ProgressCell from './ProgressCell';

const columnOptions = [
  { id: 'No.' },
  { id: 'Utilisateur' },
  { id: 'Statut' },
  { id: 'Modifié' },
  {
    id: 'Valeur du bien',
    format: value => <Money value={value} />,
    numeric: true,
  },
  {
    id: 'Hypothèque',
    format: value => <Money value={value} />,
    numeric: true,
  },
  { id: 'Progrès' },
  { id: 'Checklist' },
];

const mapLoan = history => (loan) => {
  const {
    _id: loanId,
    status,
    name,
    updatedAt,
    user: { name: userName },
    structure: { property, wantedLoan },
  } = loan;
  return {
    id: loanId,
    columns: [
      name,
      userName,
      <T id={`Forms.status.${status}`} key="status" />,
      moment(updatedAt).fromNow(),
      property ? property.value : 'Pas choisi',
      wantedLoan,
      <ProgressCell loan={loan} key="progress" />,
      <LoanChecklistDialog loan={loan} key="checklist" />,
    ],
    handleClick: () => history.push(`/loans/${loanId}`),
  };
};

const MyLoansTableContainer = compose(
  withSmartQuery({
    query: ({ currentUser: { _id: adminId } }) =>
      loansAssignedToAdmin.clone({ adminId }),
    queryOptions: { reactive: false },
    dataName: 'loans',
    renderMissingDoc: false,
  }),
  withLoansDocuments,
  withRouter,
  withProps(({ loans, history }) => ({
    columnOptions,
    rows: loans.map(mapLoan(history)),
  })),
);

export default MyLoansTableContainer;
