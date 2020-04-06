import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { compose, mapProps, withState } from 'recompose';

import StatusLabel from 'core/components/StatusLabel/StatusLabel';

import { withSmartQuery } from '../../../api/containerToolkit';
import { getReferredBy } from '../../../api/helpers';
import { LOANS_COLLECTION } from '../../../api/loans/loanConstants';
import { proPropertyLoans } from '../../../api/loans/queries';
import { removeCustomerFromProperty } from '../../../api/properties/methodDefinitions';
import { getProPropertyCustomerOwnerType } from '../../../api/properties/propertyClientHelper';
import { PROPERTY_SOLVENCY } from '../../../api/properties/propertyConstants';
import { isAllowedToRemoveCustomerFromProProperty } from '../../../api/security/clientSecurityHelpers';
import { createRoute } from '../../../utils/routerUtils';
import ConfirmMethod from '../../ConfirmMethod';
import Icon from '../../Icon';
import ProCustomer from '../../ProCustomer';
import T from '../../Translation';

const columnOptions = [
  { id: 'loanName' },
  { id: 'status' },
  { id: 'customer' },
  { id: 'createdAt' },
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

const getSolvencyLabel = solvent => {
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
    case PROPERTY_SOLVENCY.PICK_RESIDENCE_TYPE: {
      props = { type: 'waiting', className: 'warning' };
      break;
    }
    default:
      break;
  }

  return (
    <span className="customers-table-solvency">
      <Icon {...props} />
      &nbsp;
      {title}
    </span>
  );
};

const makeMapLoan = ({
  history,
  permissions,
  currentUser,
  property,
}) => loan => {
  const {
    _id: loanId,
    name: loanName,
    user,
    createdAt,
    properties,
    anonymous,
    status,
  } = loan;
  const { isAdmin } = permissions;

  const canRemoveCustomer =
    !anonymous &&
    canRemoveCustomerFromProperty({
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
      {
        raw: status,
        label: <StatusLabel status={status} collection={LOANS_COLLECTION} />,
      },
      {
        raw: !anonymous && user.name,
        label: anonymous ? (
          'Anonyme'
        ) : (
          <ProCustomer
            user={user}
            invitedByUser={
              getReferredBy({
                user,
                proUser: currentUser,
                isAdmin,
              }).label
            }
          />
        ),
      },
      { raw: createdAt.getTime(), label: moment(createdAt).fromNow() },
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
          type="modal"
        >
          <p>
            <T
              id="ProPropertyPage.removeCustomer.alert"
              values={{
                customerName: anonymous ? 'Anonyme' : user && user.name,
              }}
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

const getAnonymous = withAnonymous =>
  withAnonymous ? undefined : { $in: [null, false] };

export default compose(
  withState('withAnonymous', 'setWithAnonymous', false),
  withSmartQuery({
    query: proPropertyLoans,
    params: ({ property: { _id: propertyId }, withAnonymous }) => ({
      propertyId,
      anonymous: getAnonymous(withAnonymous),
    }),
    queryOptions: { reactive: false },
    dataName: 'loans',
  }),
  withRouter,
  mapProps(
    ({
      loans = [],
      history,
      permissions,
      property,
      currentUser,
      withAnonymous,
      setWithAnonymous,
    }) => ({
      rows: loans.map(
        makeMapLoan({ history, permissions, currentUser, property }),
      ),
      columnOptions,
      permissions,
      property,
      loans,
      withAnonymous,
      setWithAnonymous,
    }),
  ),
);
