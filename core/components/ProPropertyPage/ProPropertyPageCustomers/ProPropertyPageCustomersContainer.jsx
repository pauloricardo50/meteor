import React from 'react';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import LoanProgress from '../../LoanProgress/LoanProgress';
import LoanProgressHeader from '../../LoanProgress/LoanProgressHeader';
import { withSmartQuery } from '../../../api/containerToolkit';
import proPropertyLoans from '../../../api/loans/queries/proPropertyLoans';
import { createRoute } from '../../../utils/routerUtils';
import ConfirmMethod from '../../ConfirmMethod';
import T from '../../Translation';
import {
  getUserNameAndOrganisation,
  removeCustomerFromProperty,
} from '../../../api';
import { getProPropertyCustomerOwnerType } from '../../../api/properties/propertyClientHelper';
import { isAllowedToRemoveCustomerFromProProperty } from '../../../api/security/clientSecurityHelpers';

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

const canRemoveCustomerFromProperty = ({
  customer,
  currentUser,
  property,
  isAdmin,
}) => {
  if (isAdmin) {
    return true;
  }

  const { referredByUser, referredByOrganisation } = customer;
  const customerOwnerType = getProPropertyCustomerOwnerType({
    referredByUser,
    referredByOrganisation,
    currentUser,
  });

  return isAllowedToRemoveCustomerFromProProperty({
    property,
    currentUser,
    customerOwnerType,
  });
};

const getReferredBy = ({ user, currentUser = {}, isAdmin }) => {
  const { organisations = [] } = currentUser;
  const organisationUsers = organisations.length ? organisations[0].users : [];
  const { referredByUser = {}, referredByOrganisation = {} } = user;

  let label = 'Autre';

  if (
    isAdmin
    || organisations.some(({ _id }) => referredByOrganisation._id === _id)
    || organisationUsers.some(({ _id }) => referredByUser._id === _id)
  ) {
    label = getUserNameAndOrganisation({ user: referredByUser });
  }

  return {
    raw: referredByUser.name,
    label,
  };
};

const makeMapLoan = ({
  history,
  permissions,
  currentUser,
  property,
}) => (loan) => {
  const { _id: loanId, user, createdAt, loanProgress } = loan;
  const { isAdmin } = permissions;

  const canRemoveCustomer = canRemoveCustomerFromProperty({
    customer: user,
    currentUser,
    property,
    isAdmin,
  });

  return {
    id: loanId,
    columns: [
      user && user.name,
      user && user.phoneNumbers && user.phoneNumbers[0],
      user && user.email,
      { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
      getReferredBy({ user, currentUser, isAdmin }),
      {
        raw: loanProgress.verificationStatus,
        label: <LoanProgress loanProgress={loanProgress} />,
      },
      canRemoveCustomer ? (
        <ConfirmMethod
          method={() =>
            removeCustomerFromProperty.run({ propertyId: property._id, loanId })
          }
          label={<T id="general.remove" />}
          key="remove"
        >
          <p>
            Êtes-vous sûr de vouloir enlever l\'accès à ce bien immobilier à{' '}
            {user.name} ?
          </p>
        </ConfirmMethod>
      ) : (
        <span>-</span>
      ),
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
  mapProps(({ loans = [], history, permissions, property, currentUser }) => ({
    rows: loans.map(makeMapLoan({ history, permissions, currentUser, property })),
    columnOptions,
    permissions,
    property,
    loans,
  })),
);
