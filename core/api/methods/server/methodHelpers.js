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
