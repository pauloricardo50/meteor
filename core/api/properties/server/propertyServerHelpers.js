import UserService from '../../users/server/UserService';
import {
  shouldAnonymize as clientShouldAnonymize,
  getProPropertyCustomerOwnerType as getCustomerOwnerType,
} from '../propertyClientHelper';
import PropertyService from './PropertyService';
import LoanService from '../../loans/server/LoanService';
import { ANONYMIZED_STRING } from '../../security/constants';

const ANONYMIZED_USER = {
  name: ANONYMIZED_STRING,
  phoneNumbers: [ANONYMIZED_STRING],
  email: ANONYMIZED_STRING,
};
const anonymizeUser = ({ user, anonymous }) =>
  anonymous ? { name: 'Anonyme' } : { ...user, ...ANONYMIZED_USER };

const getUserProPropertyPermissions = ({ userId, propertyId }) => {
  const user = UserService.fetchOne({
    $filters: { _id: userId },
    proProperties: { _id: 1 },
  });

  if (!user) {
    return {};
  }

  const { proProperties: properties = [] } = user;

  const { $metadata: { permissions = {} } = {} } =
    properties.find(({ _id }) => _id === propertyId) || {};

  return permissions;
};

const getCustomerReferredBy = ({ customerId }) => {
  const { referredByUser, referredByOrganisation } =
    UserService.fetchOne({
      $filters: { _id: customerId },
      referredByUser: { _id: 1 },
      referredByOrganisation: { _id: 1 },
    }) || {};

  return { referredByUser, referredByOrganisation };
};

const getProPropertyStatus = ({ propertyId }) => {
  const { status } =
    PropertyService.fetchOne({
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

export const makeProPropertyLoanAnonymizer = ({
  anonymize,
  currentUser,
  proProperties = [],
}) => {
  let propertiesPermissionsAndStatus;
  const { proProperties: currentUserProperties = [] } = currentUser;

  if (anonymize === undefined) {
    propertiesPermissionsAndStatus = proProperties.map(property => {
      const { _id: propertyId, status } = property;
      let permissions = {};

      const proProperty = currentUserProperties.find(
        ({ _id }) => _id === propertyId,
      );

      if (proProperty) {
        permissions =
          proProperty.$metadata && proProperty.$metadata.permissions;
      }

      return {
        propertyId,
        permissions,
        status,
      };
    });
  }

  return loan => {
    const { user = {}, properties = [], ...rest } = loan;
    const { referredByOrganisation, referredByUser } = user;
    const customerOwnerType = getCustomerOwnerType({
      referredByUser,
      referredByOrganisation,
      currentUser,
    });

    const shouldAnonymizeUser =
      anonymize === undefined
        ? propertiesPermissionsAndStatus
          .map(({ permissions, status: propertyStatus }) => {
            return clientShouldAnonymize({
              customerOwnerType,
              permissions,
              propertyStatus,
            });
          })
          .every(anonymizeForProperty => anonymizeForProperty)
        : anonymize;

    return {
      user: shouldAnonymizeUser
        ? anonymizeUser({ user, anonymous: loan.anonymous })
        : user,
      properties: shouldAnonymizeUser
        ? properties.map(({ solvent, ...property }) => property)
        : properties,
      isAnonymized: !!shouldAnonymizeUser,
      ...rest,
    };
  };
};

export const removePropertyFromLoan = ({ loan, propertyId }) =>
  LoanService.update({
    loanId: loan._id,
    object: {
      structures: loan.structures.map(structure => ({
        ...structure,
        propertyId:
          structure.propertyId === propertyId ? null : structure.propertyId,
      })),
    },
  });
