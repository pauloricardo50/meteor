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
      this.handleUnauthorized('Checking if logged in');
    }

    if (userId !== Meteor.userId()) {
      this.handleUnauthorized('Checking if logged in');
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

  static checkOwnership(doc) {
    if (Meteor.userId() !== doc.userId) {
      this.handleUnauthorized('Checking ownership');
    }
  }

  static checkCurrentUserIsDev() {
    if (!this.currentUserHasRole(ROLES.DEV)) {
      this.handleUnauthorized('unauthorized developer');
    }
  }
}
