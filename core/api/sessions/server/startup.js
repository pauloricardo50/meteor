import { Meteor } from 'meteor/meteor';
import { Mutation } from 'meteor/cultofcoders:mutations';

import { getClientMicroservice } from '../../../utils/server/getClientUrl';
import SessionService from './SessionService';

Meteor.startup(() => {
  Meteor.onConnection(connection => {
    const {
      id: connectionId,
      clientAddress,
      httpHeaders: { 'x-real-ip': realIp } = {},
    } = connection;
    SessionService.insert({
      connectionId,
      ip: realIp || clientAddress,
      microservice: getClientMicroservice(),
    });

    connection.onClose(() => {
      SessionService.disconnectUser(connectionId);
      SessionService.removeSession(connectionId);
    });
  });

  Mutation.addBeforeExecution(({ context = {}, config }) => {
    const { connection = {}, userId } = context;

    const {
      id: connectionId,
      clientAddress,
      httpHeaders: { 'x-real-ip': realIp } = {},
    } = connection || {};

    const { name } = config;

    if (connectionId) {
      const session = SessionService.getByConnectionId(connectionId);

      // If session has expired, insert it again
      if (!session) {
        SessionService.insert({
          connectionId,
          ip: realIp || clientAddress,
          microservice: getClientMicroservice(),
        });
      }

      if (userId && session && !session.userId) {
        SessionService.setUser(connectionId, userId);
      }

      if (name) {
        SessionService.setLastActivity({
          connectionId,
          lastMethodCalled: name,
        });
      }
    }
  });
});
