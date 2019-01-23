import React from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import loansAssignedToAdmin from 'core/api/loans/queries/loansAssignedToAdmin';
import { Money } from 'core/components/Translation';
import { LoanChecklistDialog } from 'core/components/LoanChecklist';
import withLoansDocuments from 'core/api/files/withLoansDocuments';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';
import { LOANS_COLLECTION, USERS_COLLECTION } from 'core/api/constants';
import { CollectionIconLink } from 'core/components/IconLink';
import Calculator from 'core/utils/Calculator';
import ProgressCell from './ProgressCell';

const columnOptions = [
  { id: 'No.' },
  { id: 'Utilisateur' },
  { id: 'Statut' },
  { id: 'Modifié' },
  {
    id: 'Valeur du bien',
    format: value => <Money value={value} />,
    align: 'right',
  },
  {
    id: 'Hypothèque',
    format: value => <Money value={value} />,
    align: 'right',
  },
  { id: 'Progrès' },
  { id: 'Checklist' },
];

const mapLoan = history => (loan) => {
  const { _id: loanId, status, name, updatedAt, user } = loan;
  
  return {
    id: loanId,
    columns: [
      name || 'Emprunteur sans nom',
      <CollectionIconLink
        relatedDoc={{ ...user, collection: USERS_COLLECTION }}
        key="user"
      />,
      <StatusLabel
        status={status}
        key="status"
        collection={LOANS_COLLECTION}
      />,
      {
        raw: updatedAt && updatedAt.getTime(),
        label: moment(updatedAt).fromNow(),
      },
      Calculator.selectPropertyValue({ loan }),
      Calculator.selectLoanValue({ loan }),
      <ProgressCell loan={loan} key="progress" />,
      <LoanChecklistDialog loan={loan} key="checklist" />,
    ],
    handleClick: () => history.push(`/loans/${loanId}`),
  };
};

const MyLoansTableContainer = compose(
  withSmartQuery({
    query: loansAssignedToAdmin,
    params: ({ currentUser: { _id: adminId } }) => ({ adminId }),
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
