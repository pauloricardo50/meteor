import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { ROLES } from '../constants';

export const SECURITY_ERROR = 'NOT_AUTHORIZED';

export default class Security {
  static hasRole(userId, role) {
    return Roles.userIsInRole(userId, role);
  }

  static handleUnauthorized() {
    throw new Meteor.Error(SECURITY_ERROR);
  }

  static checkRole(userId, role) {
    if (!this.hasRole(userId, role)) {
      this.handleUnauthorized();
    }
  }

  static checkLoggedIn() {
    if (!Meteor.userId()) {
      this.handleUnauthorized();
    }
  }

  static currentUserHasRole(role) {
    return this.hasRole(Meteor.userId(), role);
  }

  static currentUserIsAdmin() {
    return (
      this.hasRole(Meteor.userId(), ROLES.ADMIN) ||
      this.hasRole(Meteor.userId(), ROLES.DEV)
    );
  }

  static checkCurrentUserIsAdmin() {
    if (!this.currentUserIsAdmin()) {
      this.handleUnauthorized();
    }
  }

  static checkOwnership(doc) {
    if (Meteor.userId() !== doc.userId) {
      this.handleUnauthorized();
    }
  }
}
