import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import get from 'lodash/get';

import { flattenObject } from '../helpers';
import { ROLES, COLLECTIONS } from '../constants';
import { DOCUMENT_USER_PERMISSIONS } from './constants';

export const SECURITY_ERROR = 'NOT_AUTHORIZED';

export default class Security {
  static hasRole(userId, role) {
    return Roles.userIsInRole(userId, role);
  }

  static handleUnauthorized(message) {
    throw new Meteor.Error(SECURITY_ERROR, message);
  }

  static checkRole(userId, role) {
    if (!this.hasRole(userId, role)) {
      this.handleUnauthorized(`Checking role: ${role}`);
    }
  }

  static checkLoggedIn() {
    this.checkUserLoggedIn(Meteor.userId());
  }

  // Not in use at the moment, but might need in future, we can refine this method more
  static isAccountDisabled(user) {
    return (!user || user.isDisabled);
  }

  static checkUserLoggedIn(userId) {
    if (!userId) {
      this.handleUnauthorized('Checking if logged in, no user');
    }

    if (userId !== Meteor.userId()) {
      this.handleUnauthorized('Checking if logged in, not the right user');
    }
  }

  static checkLoggedOut() {
    if (Meteor.userId()) {
      this.handleUnauthorized('Checking if logged out');
    }
  }

  static currentUserHasRole(role) {
    return this.hasRole(Meteor.userId(), role);
  }

  static isUserAdmin(userId) {
    return this.hasRole(userId, ROLES.ADMIN) || this.hasRole(userId, ROLES.DEV);
  }

  static isUserDev(userId) {
    return this.hasRole(userId || Meteor.userId(), ROLES.DEV);
  }

  static isUserPro(userId) {
    return (
      this.hasRole(userId, ROLES.PRO)
      || this.hasRole(userId, ROLES.ADMIN)
      || this.hasRole(userId, ROLES.DEV)
    );
  }

  static currentUserIsAdmin() {
    const userId = Meteor.userId();
    return this.hasRole(userId, ROLES.ADMIN) || this.hasRole(userId, ROLES.DEV);
  }

  static checkCurrentUserIsAdmin() {
    if (!this.currentUserIsAdmin()) {
      this.handleUnauthorized('Checking if current user is admin');
    }
  }

  static checkUserIsAdmin(userId) {
    if (!this.isUserAdmin(userId)) {
      this.handleUnauthorized('Checking if user is admin');
    }
  }

  static checkUserIsDev(userId) {
    if (!this.isUserDev(userId)) {
      this.handleUnauthorized('Checking if user is dev');
    }
  }

  static checkUserIsPro(userId) {
    if (!this.isUserPro(userId)) {
      this.handleUnauthorized('Checking if user is pro');
    }
  }

  static checkOwnership(doc, userId) {
    userId = userId || Meteor.userId();
    const userIdIsValid = doc && doc.userId === userId;
    const userLinksIsValid = doc
      && doc.userLinks
      && doc.userLinks.filter(({ _id }) => userId === _id).length > 0;

    if (!(userIdIsValid || userLinksIsValid)) {
      this.handleUnauthorized('Checking ownership');
    }
  }

  static checkRequiredPermissions({ requiredPermissions, userPermissions }) {
    if (
      !Object.keys(flattenObject(requiredPermissions)).every((permission) => {
        const userPermission = get(userPermissions, permission);
        const requiredPermission = get(requiredPermissions, permission);

        if (!userPermission) {
          return false;
        }

        if (Array.isArray(requiredPermission)) {
          if (!Array.isArray(userPermission)) {
            return false;
          }
          return requiredPermission.every(required =>
            userPermission.includes(required));
        }

        return userPermission === requiredPermission;
      })
    ) {
      this.handleUnauthorized('Checking permissions');
    }
  }

  static hasPermissionOnDoc({
    doc,
    requiredPermissions,
    userId = Meteor.userId(),
  }) {
    const { userLinks = [], users = [] } = doc;

    const user = userLinks.find(({ _id }) => _id === userId)
      || users.find(({ _id }) => _id === userId);

    if (!user) {
      this.handleUnauthorized('Checking permissions');
    }

    const userPermissions = user.permissions || user.$metadata.permissions;

    this.checkRequiredPermissions({ requiredPermissions, userPermissions });
  }

  static checkCurrentUserIsDev() {
    if (!this.currentUserHasRole(ROLES.DEV)) {
      this.handleUnauthorized('unauthorized developer');
    }

    return true;
  }

  static hasMinimumRole({ role, userId }) {
    let allowedRoles;

    switch (role) {
    case ROLES.DEV:
      allowedRoles = [ROLES.DEV];
      break;
    case ROLES.ADMIN:
      allowedRoles = [ROLES.DEV, ROLES.ADMIN];
      break;
    case ROLES.USER:
      allowedRoles = [ROLES.DEV, ROLES.ADMIN, ROLES.USER];
      break;
    case ROLES.PRO:
      allowedRoles = [ROLES.DEV, ROLES.ADMIN, ROLES.PRO];
      break;

    default:
      throw new Meteor.Error(`Invalid role: ${role} at minimumRole`);
    }

    const isAllowed = allowedRoles.some(allowedRole =>
      this.hasRole(userId, allowedRole));

    if (!isAllowed) {
      return false;
    }

    return true;
  }

  static minimumRole(role) {
    return userId =>
      (this.hasMinimumRole({ userId, role })
        ? undefined
        : this.handleUnauthorized('Unauthorized role'));
  }

  static canModifyDoc = (doc) => {
    // Only for client side docs that replace userLinks with users
    const { _id: userId } = Meteor.user();
    if (this.minimumRole(ROLES.ADMIN)(userId)) {
      return;
    }

    const me = doc.users.find(({ _id }) => _id === userId);

    return (
      me
      && me.$metadata
      && me.$metadata.permissions === DOCUMENT_USER_PERMISSIONS.MODIFY
    );
  };

  static isAllowedToModifyFiles({ collection, docId, userId, fileKey }) {
    const keyId = fileKey.split('/')[0];

    if (keyId !== docId) {
      this.handleUnauthorized('Invalid fileKey or docId');
    }

    try {
      this.minimumRole(ROLES.ADMIN)(userId);
      return;
    } catch (error) {}

    switch (collection) {
    case COLLECTIONS.PROMOTIONS_COLLECTION: {
      this.promotions.isAllowedToManageDocuments({
        promotionId: docId,
        userId,
      });
      break;
    }
    case COLLECTIONS.PROPERTIES_COLLECTION: {
      if (this.properties.isPromotionLot(docId)) {
        this.promotions.isAllowedToManagePromotionLotDocuments({
          propertyId: docId,
          userId,
        });
        break;
      }

      this.properties.isAllowedToUpdate(docId, userId);
      break;
    }
    default:
      this[collection].isAllowedToUpdate(docId);
    }
  }
}
