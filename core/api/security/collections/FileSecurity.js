import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import LoanService from '../../loans/server/LoanService';
import BorrowerService from '../../borrowers/server/BorrowerService';
import PropertyService from '../../properties/server/PropertyService';
import { PROPERTY_CATEGORY } from '../../properties/propertyConstants';
import { FILE_ROLES } from '../../files/fileConstants';
import PromotionService from '../../promotions/server/PromotionService';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import S3Service from '../../files/server/S3Service';
import FileService from '../../files/server/FileService';
import Security from '../Security';

class FileSecurity {
  static getFileRoles = rolesString => {
    const roles = rolesString.split(',').filter(x => x);
    const hasNoRole = !roles.length;
    const hasPublicRole = roles.includes(FILE_ROLES.PUBLIC);
    const hasUserRole = roles.includes(FILE_ROLES.USER);
    const hasProRole = roles.includes(FILE_ROLES.PRO);
    const hasAdminRole = roles.includes(FILE_ROLES.ADMIN);

    return { hasNoRole, hasPublicRole, hasUserRole, hasProRole, hasAdminRole };
  };

  static getUserRoles = userId => {
    const isAdmin = Roles.userIsInRole(userId, 'admin');
    const isDev = Roles.userIsInRole(userId, 'dev');
    const isPro = Roles.userIsInRole(userId, 'pro');
    const isUser = Roles.userIsInRole(userId, 'user');

    return { isAdmin, isDev, isPro, isUser };
  };

  static handleProPropertyFile = ({ key, roles, userRoles }) => {
    const { docId: keyId } = FileService.getKeyParts(key);
    const { hasNoRole, hasPublicRole, hasUserRole, hasProRole } = roles;
    const { isUser, isPro } = userRoles;

    const property = PropertyService.get(keyId, { category: 1, userId: 1 });

    if (
      property &&
      (property.category === PROPERTY_CATEGORY.PRO ||
        property.category === PROPERTY_CATEGORY.PROMOTION)
    ) {
      return (
        hasNoRole ||
        hasPublicRole ||
        (isPro && hasProRole) ||
        (isUser && hasUserRole)
      );
    }

    return false;
  };

  static handlePromotionFile = ({ key, roles, userRoles }) => {
    const { docId: keyId } = FileService.getKeyParts(key);
    const { hasNoRole, hasPublicRole, hasUserRole, hasProRole } = roles;
    const { isUser, isPro } = userRoles;

    const promotionFound = !!PromotionService.get(keyId, { _id: 1 });

    if (promotionFound) {
      return (
        hasNoRole ||
        hasPublicRole ||
        (isPro && hasProRole) ||
        (isUser && hasUserRole)
      );
    }

    return false;
  };

  static handlePromotionOptionFile = ({ key, roles, userRoles, userId }) => {
    const { docId: keyId } = FileService.getKeyParts(key);
    const { hasNoRole, hasPublicRole, hasUserRole, hasProRole } = roles;
    const { isUser, isPro } = userRoles;

    const promotionOption = PromotionOptionService.get(keyId, { _id: 1 });

    if (promotionOption) {
      try {
        Security.promotions.isAllowedToManagePromotionReservation({
          promotionOptionId: promotionOption._id,
          userId,
        });

        return (
          hasNoRole ||
          hasPublicRole ||
          (isPro && hasProRole) ||
          (isUser && hasUserRole)
        );
      } catch (error) {
        return false;
      }
    }

    return false;
  };

  static handleOwnerFile = ({ key, userId }) => {
    const { docId: keyId } = FileService.getKeyParts(key);
    const loanFound = !!LoanService.get(
      {
        _id: keyId,
        userId,
      },
      { _id: 1 },
    );

    if (loanFound) {
      return true;
    }

    const borrowerFound = !!BorrowerService.get(
      {
        _id: keyId,
        userId,
      },
      { _id: 1 },
    );

    if (borrowerFound) {
      return true;
    }

    const property = PropertyService.get(keyId, { category: 1, userId: 1 });

    if (
      property &&
      (!property.category || property.category === PROPERTY_CATEGORY.USER) &&
      property.userId === userId
    ) {
      return true;
    }

    return false;
  };

  static isAllowedToAccess = async ({ userId, key }) => {
    const userRoles = this.getUserRoles(userId);
    const { isAdmin, isDev } = userRoles;

    if (isAdmin || isDev) {
      return true;
    }

    const {
      Metadata: { roles: rolesString = '' },
    } = await S3Service.headObject(key);

    const roles = this.getFileRoles(rolesString);
    const { hasPublicRole } = roles;

    if (hasPublicRole) {
      return true;
    }

    if (this.handleOwnerFile({ key, userId })) {
      return true;
    }

    if (this.handleProPropertyFile({ key, roles, userRoles })) {
      return true;
    }

    if (this.handlePromotionFile({ key, roles, userRoles })) {
      return true;
    }

    if (this.handlePromotionOptionFile({ key, roles, userRoles, userId })) {
      return true;
    }

    throw new Meteor.Error('Unauthorized download');
  };
}

export default FileSecurity;
