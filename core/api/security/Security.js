import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { ROLES } from '../constants';

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

  static checkUserIsPro(userId) {
    if (!this.isUserPro(userId)) {
      this.handleUnauthorized('Checking if user is pro');
    }
  }

  static checkOwnership(doc) {
    const userId = Meteor.userId();
    const userIdIsValid = doc && doc.userId === userId;
    const userLinksIsValid = doc
      && doc.userLinks
      && doc.userLinks.filter(({ _id }) => userId === _id).length > 0;

    if (!(userIdIsValid || userLinksIsValid)) {
      this.handleUnauthorized('Checking ownership');
    }
  }

  static checkCurrentUserIsDev() {
    if (!this.currentUserHasRole(ROLES.DEV)) {
      this.handleUnauthorized('unauthorized developer');
    }
  }

  static minimumRole(role) {
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

    return (userId) => {
      const isAllowed = allowedRoles.some(allowedRole =>
        this.hasRole(userId, allowedRole));

      if (!isAllowed) {
        this.handleUnauthorized('Unauthorized role');
      }
    };
  }
}
