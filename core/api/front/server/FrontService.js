import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';
import { ddpWithUserId } from '../../methods/methodHelpers';
import { ERROR_CODES } from '../../errors';

const FRONT_AUTH_SECRET = Meteor.settings.front?.authSecret;

class FrontService {
  checkAuth({ body: { authSecret, email } = {} }) {
    if (!authSecret || authSecret !== FRONT_AUTH_SECRET) {
      throw new Meteor.Error(ERROR_CODES.UNAUTHORIZED, 'Authentication failed');
    }

    const user =
      email &&
      UserService.get(
        { 'emails.0.address': email, roles: { $in: [ROLES.DEV, ROLES.ADMIN] } },
        { _id: 1 },
      );

    return { isAuthenticated: !!user, user };
  }

  handleRequest(body) {
    const { type, params, user } = body;

    if (type === 'QUERY_ONE' || type === 'QUERY') {
      return this.handleQuery({ user, type, ...params });
    }

    if (type === 'METHOD') {
      return this.handleMethod({ user, ...params });
    }

    throw new Error(`Unknown Front App API type "${type}"`);
  }

  handleQuery({ collectionName, type, query }) {
    const collection = Mongo.Collection.get(collectionName);

    if (type === 'QUERY_ONE') {
      return collection.createQuery(query).fetchOne();
    }

    if (type === 'QUERY') {
      return collection.createQuery(query).fetch();
    }

    throw new Error(`Front query type must be QUERY_ONE or QUERY: "${type}"`);
  }

  handleMethod({ user: { _id }, methodName, ...params }) {
    return new Promise((resolve, reject) => {
      ddpWithUserId(_id, () => {
        Meteor.call(methodName, params[0], (error, result) => {
          if (error) {
            reject(error);
          }

          resolve(result);
        });
      });
    });
  }
}

export default new FrontService();
