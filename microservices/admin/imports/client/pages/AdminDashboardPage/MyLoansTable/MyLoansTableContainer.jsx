import React from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import loansAssignedToAdmin from 'core/api/loans/queries/loansAssignedToAdmin';
import { Money } from 'core/components/Translation';
import { LoanChecklistDialog } from 'core/components/LoanChecklist';
import ProgressCell from './ProgressCell';

const columnOptions = [
  { id: 'No.' },
  { id: 'Utilisateur' },
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
    queryOptions: { reactive: true },
    dataName: 'loans',
    renderMissingDoc: false,
  }),
  withRouter,
  withProps(({ loans, history }) => ({
    columnOptions,
    rows: loans.map(mapLoan(history)),
  })),
);

export default MyLoansTableContainer;
