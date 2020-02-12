import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import UserService from 'core/api/users/server/UserService';
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
    const user = UserService.get(userId, { roles: 1 });
    const isAdmin = Roles.userIsInRole(user, 'admin');
    const isDev = Roles.userIsInRole(user, 'dev');
    const isPro = Roles.userIsInRole(user, 'pro');
    const isUser = Roles.userIsInRole(user, 'user');

    return { isAdmin, isDev, isPro, isUser };
  };

  static checkDocumentExists = ({ collection, filters }) => {
    switch (collection) {
      case 'properties': {
        return PropertyService.exists(filters);
      }
      case 'loans': {
        return LoanService.exists(filters);
      }
      case 'borrowers': {
        return BorrowerService.exists(filters);
      }
      case 'promotionOptions': {
        return PromotionOptionService.exists(filters);
      }
      case 'promotions': {
        return PromotionService.exists(filters);
      }
      default:
        return false;
    }
  };

  static checkHasAccessToFileFromCollection = ({
    key,
    collection,
    roles,
    userRoles,
    filters = {},
    options = {},
    userId,
  }) => {
    const { docId } = FileService.getKeyParts(key);

    const documentExists = this.checkDocumentExists({
      collection,
      filters: { _id: docId, ...filters },
    });

    if (!documentExists) {
      return false;
    }
    const { checkExistsOnly } = options;

    if (checkExistsOnly) {
      return documentExists;
    }

    const { hasNoRole, hasPublicRole, hasUserRole, hasProRole } = roles;
    const { isUser, isPro } = userRoles;

    const defaultReturn =
      hasNoRole ||
      hasPublicRole ||
      (isPro && hasProRole) ||
      (isUser && hasUserRole);

    switch (collection) {
      case 'promotionOptions': {
        try {
          Security.promotions.isAllowedToManagePromotionReservation({
            promotionOptionId: docId,
            userId,
          });

          return defaultReturn;
        } catch (error) {
          return false;
        }
      }
      default:
        return defaultReturn;
    }
  };

  static getCollectionsFileAccessParams = userId => [
    {
      collection: 'loans',
      filters: { userId },
      options: { checkExistsOnly: true },
    },
    {
      collection: 'borrowers',
      filters: { userId },
      options: { checkExistsOnly: true },
    },
    {
      collection: 'properties',
      filters: {
        userId,
        category: PROPERTY_CATEGORY.USER,
      },
      options: { checkExistsOnly: true },
    },
    {
      collection: 'properties',
      filters: {
        category: {
          $in: [PROPERTY_CATEGORY.PRO, PROPERTY_CATEGORY.PROMOTION],
        },
      },
    },
    { collection: 'promotions' },
    { collection: 'promotionOptions' },
  ];

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

    if (
      this.getCollectionsFileAccessParams(userId).some(params =>
        this.checkHasAccessToFileFromCollection({
          userId,
          key,
          roles,
          userRoles,
          ...params,
        }),
      )
    ) {
      return true;
    }

    throw new Meteor.Error('Unauthorized download');
  };
}

export default FileSecurity;
