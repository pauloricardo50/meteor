import React from 'react';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { PROPERTY_SOLVENCY } from 'core/api/constants';
import LoanProgress from '../../LoanProgress/LoanProgress';
import LoanProgressHeader from '../../LoanProgress/LoanProgressHeader';
import { withSmartQuery } from '../../../api/containerToolkit';
import proPropertyLoans from '../../../api/loans/queries/proPropertyLoans';
import { createRoute } from '../../../utils/routerUtils';
import ConfirmMethod from '../../ConfirmMethod';
import T from '../../Translation';
import { removeCustomerFromProperty, getReferredBy } from '../../../api';
import { getProPropertyCustomerOwnerType } from '../../../api/properties/propertyClientHelper';
import { isAllowedToRemoveCustomerFromProProperty } from '../../../api/security/clientSecurityHelpers';
import Icon from '../../Icon';
import Tooltip from '../../Material/Tooltip';

const columnOptions = [
  { id: 'loanName' },
  { id: 'name' },
  { id: 'phone' },
  { id: 'email' },
  { id: 'createdAt' },
  { id: 'referredBy' },
  { id: 'progress', label: <LoanProgressHeader /> },
  { id: 'solvency' },
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

const getSolvencyLabel = (solvent) => {
  const title = <T id={`Forms.solvency.${solvent}`} />;
  let props = {};
  switch (solvent) {
  case PROPERTY_SOLVENCY.UNDETERMINED: {
    props = { type: 'waiting', className: 'warning' };
    break;
  }
  case PROPERTY_SOLVENCY.NOT_SHARED: {
    props = { type: 'eyeCrossed', className: 'warning' };
    break;
  }
  case PROPERTY_SOLVENCY.SOLVENT: {
    props = { type: 'check', className: 'success' };
    break;
  }
  case PROPERTY_SOLVENCY.INSOLVENT: {
    props = { type: 'close', className: 'error' };
    break;
  }
  default:
    break;
  }

  return (
    <span className="customers-table-solvency">
      <Icon {...props} />
      &nbsp;{title}
    </span>
  );
};

const makeMapLoan = ({
  history,
  permissions,
  currentUser,
  property,
}) => (loan) => {
  const {
    _id: loanId,
    name: loanName,
    user,
    createdAt,
    loanProgress,
    properties,
  } = loan;
  const { isAdmin } = permissions;

  const canRemoveCustomer = canRemoveCustomerFromProperty({
    customer: user,
    currentUser,
    property,
    isAdmin,
  });

  const { solvent } = properties.find(({ _id }) => _id === property._id) || {};

  return {
    id: loanId,
    columns: [
      loanName,
      user && user.name,
      user && user.phoneNumbers && user.phoneNumbers[0],
      user && user.email,
      { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
      getReferredBy({ user, proUser: currentUser, isAdmin }),
      {
        raw: loanProgress.verificationStatus,
        label: <LoanProgress loanProgress={loanProgress} />,
      },
      {
        raw: solvent,
        label: solvent ? getSolvencyLabel(solvent) : '-',
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
            <T
              id="ProPropertyPage.removeCustomer.alert"
              values={{ customerName: user.name }}
            />
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
