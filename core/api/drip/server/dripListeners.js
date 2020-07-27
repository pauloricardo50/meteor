import { Meteor } from 'meteor/meteor';

import { employeesByEmail } from '../../../arrays/epotekEmployees';
import ServerEventService from '../../events/server/ServerEventService';
import {
  adminCreateUser,
  anonymousCreateUser,
  assignAdminToUser,
  changeEmail,
  proInviteUser,
  removeUser,
  setRole,
  setUserStatus,
  userVerifyEmail,
} from '../../users/methodDefinitions';
import UserService from '../../users/server/UserService';
import { ROLES, USER_STATUS } from '../../users/userConstants';
import { DRIP_ACTIONS } from '../dripConstants';
import { DripService as DripServiceClass } from './DripService';

// Avoids all tests that call the listened methods to
// call Drip API and trigger "Too many concurrent requests for the same subscriber"
const DripService = new DripServiceClass({ enableAPI: !Meteor.isTest });

ServerEventService.addAfterMethodListener(
  [proInviteUser, anonymousCreateUser],
  ({
    params: {
      user: { email },
    },
  }) => {
    DripService.createSubscriber({ email });
  },
);

ServerEventService.addAfterMethodListener(
  adminCreateUser,
  ({
    params: {
      user: { email },
    },
  }) => {
    const user = UserService.getByEmail(email, { _id: 1 });

    if (user?._id) {
      UserService.setStatus({
        userId: user?._id,
        status: USER_STATUS.QUALIFIED,
      });
    }
  },
);

ServerEventService.addAfterMethodListener(userVerifyEmail, ({ context }) => {
  context.unblock();
  const user = UserService.get(context.userId, {
    email: 1,
    firstName: 1,
    lastName: 1,
    phoneNumbers: 1,
    assignedRoles: 1,
  });

  if (user?.assignedRoles?.[0] !== ROLES.USER) {
    return;
  }

  DripService.updateSubscriber({
    email: user?.email,
    object: {
      first_name: user?.firstName,
      last_name: user?.lastName,
      phone: user?.phoneNumbers?.[0],
    },
  });
  DripService.trackEvent({
    event: { action: DRIP_ACTIONS.USER_VALIDATED },
    email: user?.email,
  });
});

ServerEventService.addBeforeMethodListener(
  removeUser,
  ({ params: { userId } }) => {
    try {
      const user = UserService.get(userId, { email: 1 });
      DripService.removeSubscriber({ email: user?.email });
    } catch (error) {
      // The subscriber did not exist on Drip
    }
  },
);

ServerEventService.addAfterMethodListener(
  setRole,
  ({ params: { userId, role } }) => {
    // Remove subscriber from Drip if it's not a USER anymore
    if (role === ROLES.USER) {
      return;
    }

    const user = UserService.get(userId, { email: 1 });

    DripService.removeSubscriber({ email: user?.email });
  },
);

ServerEventService.addAfterMethodListener(
  changeEmail,
  async ({ result: { oldEmail, newEmail } }) => {
    try {
      const { subscribers = [] } = await DripService.fetchSubscriber({
        subscriber: { email: oldEmail },
      });
      const [subscriber] = subscribers;
      DripService.upsertSubscriber({
        subscriber: { id: subscriber?.id, email: newEmail },
      });
    } catch (error) {
      DripService.createSubscriber({ email: newEmail });
    }
  },
);

ServerEventService.addAfterMethodListener(
  assignAdminToUser,
  ({ params: { userId } }) => {
    const user = UserService.get(userId, {
      email: 1,
      assignedEmployee: { name: 1, email: 1 },
    });

    try {
      DripService.updateSubscriber({
        email: user?.email,
        object: {
          custom_fields: {
            assigneeEmailAddress: user?.assignedEmployee?.email,
            assigneeName: user?.assignedEmployee?.name,
            assigneeCalendlyLink:
              employeesByEmail[user?.assignedEmployee?.email]?.calendly,
          },
        },
      });
    } catch (error) {
      // Subscriber did not exist on Drip
    }
  },
);

ServerEventService.addAfterMethodListener(
  setUserStatus,
  ({ params: { userId, status } }) => {
    if (status === USER_STATUS.PROSPECT) {
      return;
    }

    const { email } = UserService.get(userId, { email: 1 });

    switch (status) {
      case USER_STATUS.QUALIFIED: {
        return DripService.trackEvent({
          event: { action: DRIP_ACTIONS.USER_QUALIFIED },
          email,
        });
      }

      case USER_STATUS.LOST: {
        return DripService.removeSubscriber({ email });
      }

      default:
        return undefined;
    }
  },
);
