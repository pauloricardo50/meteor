import { DDPCommon } from 'meteor/ddp-common';
import { DDP } from 'meteor/ddp-client';

export const ddpWithUserId = (userId, func) => {
  const invocation = new DDPCommon.MethodInvocation({
    userId,
    // isSimulation: false,
    // setUserId,
    // unblock,
    // connection: self.connectionHandle,
    // randomSeed,
  });

  return DDP._CurrentInvocation.withValue(invocation, func);
};

// Used to call meteor methods that can be called internally only
// This fake userId is asserted in SecurityService
export const internalMethod = func => ddpWithUserId('INTERNAL_CALL', func);

// This can help you determine whether you are allowed to call
// Meteor.user() or Meteor.userId() on the server
export const isMeteorMethod = () =>
  !!(
    DDP._CurrentMethodInvocation.get() ||
    DDP._CurrentPublicationInvocation.get()
  );
