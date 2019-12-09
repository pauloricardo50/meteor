import UserService from '../../users/server/UserService';
import {
  shouldAnonymize as clientShouldAnonymize,
  getProPropertyCustomerOwnerType as getCustomerOwnerType,
} from '../propertyClientHelper';
import PropertyService from './PropertyService';
import LoanService from '../../loans/server/LoanService';
import { anonymizeLoan } from '../../loans/helpers';

const getCustomerReferredBy = ({ customerId }) => {
  const { referredByUser, referredByOrganisation } =
    UserService.get(customerId, {
      referredByUser: { _id: 1 },
      referredByOrganisation: { _id: 1 },
    }) || {};

  return { referredByUser, referredByOrganisation };
};

export const getProPropertyCustomerOwnerType = ({ customerId, userId }) => {
  const { referredByUser, referredByOrganisation } = getCustomerReferredBy({
    customerId,
  });
  const user = UserService.get(userId, {
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
    const { user = {} } = loan;
    const { referredByOrganisation, referredByUser } = user;
    const customerOwnerType = getCustomerOwnerType({
      referredByUser,
      referredByOrganisation,
      currentUser,
    });

    const shouldAnonymizeUser =
      anonymize === undefined
        ? propertiesPermissionsAndStatus
          .map(({ permissions, status: propertyStatus }) =>
            clientShouldAnonymize({
              customerOwnerType,
              permissions,
              propertyStatus,
            }),
          )
          .every(anonymizeForProperty => anonymizeForProperty)
        : anonymize;

    return anonymizeLoan({ loan, shouldAnonymize: shouldAnonymizeUser });
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
