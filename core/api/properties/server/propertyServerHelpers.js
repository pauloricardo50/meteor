import UserService from '../../users/server/UserService';
import {
  shouldAnonymize as clientShouldAnonymize,
  getProPropertyCustomerOwnerType as getCustomerOwnerType,
} from '../propertyClientHelper';
import PropertyService from './PropertyService';

const ANONYMIZED_STRING = 'XXX';
const ANONYMIZED_USER = {
  name: ANONYMIZED_STRING,
  phoneNumbers: [ANONYMIZED_STRING],
  email: ANONYMIZED_STRING,
};

const getUserProPropertyPermissions = ({ userId, propertyId }) => {
  const user = UserService.fetchOne({
    $filters: { _id: userId },
    properties: { _id: 1 },
  });

  if (!user) {
    return {};
  }

  const { properties = [] } = user;

  const {
    $metadata: { permissions = {} },
  } = properties.find(({ _id }) => _id === propertyId);

  return permissions;
};

const getCustomerReferredBy = ({ customerId }) => {
  const { referredByUser, referredByOrganisation } = UserService.fetchOne({
    $filters: { _id: customerId },
    referredByUser: { _id: 1 },
    referredByOrganisation: { _id: 1 },
  }) || {};

  return { referredByUser, referredByOrganisation };
};

const getProPropertyStatus = ({ propertyId }) => {
  const { status } = PropertyService.fetchOne({
    $filters: { _id: propertyId },
    status: 1,
  }) || {};

  return status;
};

export const getProPropertyCustomerOwnerType = ({ customerId, userId }) => {
  const { referredByUser, referredByOrganisation } = getCustomerReferredBy({
    customerId,
  });
  const user = UserService.fetchOne({
    $filters: { _id: userId },
    organisations: { users: { _id: 1 } },
  });

  if (!user) {
    return null;
  }

  const { organisations = [] } = user;

  return getCustomerOwnerType({
    referredByUser,
    referredByOrganisation,
    currentUser: { _id: userId, organisations },
  });
};

const shouldAnonymize = ({ customerId, userId, propertyId }) => {
  const customerOwnerType = getProPropertyCustomerOwnerType({
    customerId,
    userId,
  });
  const permissions = getUserProPropertyPermissions({ userId, propertyId });

  const propertyStatus = getProPropertyStatus({ propertyId });

  return clientShouldAnonymize({
    customerOwnerType,
    permissions,
    propertyStatus,
  });
};

export const makeProPropertyLoanAnonymizer = ({
  userId,
  propertyId,
  anonymize,
}) => {
  let permissions;
  let propertyStatus;

  if (anonymize === undefined) {
    permissions = getUserProPropertyPermissions({ userId, propertyId });
    propertyStatus = getProPropertyStatus({ propertyId });
  }

  return (loan) => {
    const { user = {}, ...rest } = loan;
    const { _id: customerId } = user;
    const customerOwnerType = getProPropertyCustomerOwnerType({
      customerId,
      propertyId,
      userId,
    });

    const anonymizeUser = anonymize === undefined
      ? clientShouldAnonymize({
        customerOwnerType,
        permissions,
        propertyStatus,
      })
      : anonymize;

    return {
      user: anonymizeUser ? ANONYMIZED_USER : user,
      ...rest,
    };
  };
};
