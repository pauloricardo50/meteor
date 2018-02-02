// file: /imports/api/security.js
import { Roles } from "meteor/alanning:roles";
import { Meteor } from "meteor/meteor";

export default class Security {
    static checkRole(userId, role) {
        if (!this.hasRole(userId, role)) {
            throw new Meteor.Error("not-authorized");
        }
    }

    static currentUserHasRole(role) {
        if (!Meteor.isClient) {
            throw new Meteor.Error(
                "not-allowed",
                "This method is only available on the client"
            );
        }

        return this.hasRole(Meteor.userId(), role);
    }

    static hasRole(userId, role) {
        return Roles.userIsInRole(userId, role);
    }

    static checkLoggedIn(userId) {
        if (!userId) {
            throw new Meteor.Error("not-authorized", "You are not authorized");
        }
    }

    static checkAdmin(userId) {
        this.checkRole(userId, "admin");
    }
}
