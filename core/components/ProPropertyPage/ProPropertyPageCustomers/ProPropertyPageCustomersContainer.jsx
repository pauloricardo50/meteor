import { Meteor } from 'meteor/meteor';

import React from 'react';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import LoanProgress from 'core/components/LoanProgress/LoanProgress';
import LoanProgressHeader from 'core/components/LoanProgress/LoanProgressHeader';
import { withSmartQuery } from '../../../api/containerToolkit';
import proPropertyLoans from '../../../api/loans/queries/proPropertyLoans';
import { createRoute } from '../../../utils/routerUtils';
import ConfirmMethod from '../../ConfirmMethod';
import T from '../../Translation';
import { getUserNameAndOrganisation } from '../../../api';

const columnOptions = [
  { id: 'name' },
  { id: 'phone' },
  { id: 'email' },
  { id: 'createdAt' },
  { id: 'referredBy' },
  { id: 'progress', label: <LoanProgressHeader /> },
  { id: 'actions' },
].map(({ id, label }) => ({
  id,
  label: label || <T id={`Forms.${id}`} />,
}));

const makeMapLoan = history => (loan) => {
  const { _id: loanId, user, createdAt, loanProgress } = loan;
  const isAdmin = Meteor.microservice === 'admin';

  return {
    id: loanId,
    columns: [
      user && user.name,
      user && user.phoneNumbers && user.phoneNumbers[0],
      user && user.email,
      { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
      {
        raw: user.referredByUser && user.referredByUser.name,
        label:
          user.referredByUser
          && getUserNameAndOrganisation({ user: user.referredByUser }),
      },
      {
        raw: loanProgress.verificationStatus,
        label: <LoanProgress loanProgress={loanProgress} />,
      },
      <ConfirmMethod
        method={() => console.log('remove!')}
        label={<T id="general.remove" />}
        key="remove"
      />,
    ],
    ...(isAdmin
      ? {
        handleClick: () =>
          history.push(createRoute('/loans/:loanId', { loanId })),
      }
      : {}),
  };
};

export default compose(
  withSmartQuery({
    query: proPropertyLoans,
    params: ({ property: { _id: propertyId } }) => ({ propertyId }),
    queryOptions: { reactive: false },
    dataName: 'loans',
  }),
  withRouter,
  mapProps(({ loans = [], history, permissions, property }) => ({
    rows: loans.map(makeMapLoan(history)),
    columnOptions,
    permissions,
    property,
  })),
);
