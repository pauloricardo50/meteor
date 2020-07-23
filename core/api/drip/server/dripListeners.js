import { employeesByEmail } from '../../../arrays/epotekEmployees';
import ServerEventService from '../../events/server/ServerEventService';
import {
  anonymousCreateUser,
  assignAdminToUser,
  changeEmail,
  proInviteUser,
  removeUser,
  setRole,
  userVerifyEmail,
} from '../../users/methodDefinitions';
import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';
import { DRIP_ACTIONS } from '../dripConstants';
import DripService from './DripService';

ServerEventService.addAfterMethodListener(
  [proInviteUser, anonymousCreateUser],
  ({ params: { user: email } }) => {
    DripService.createSubscriber({ email });
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
      const { subscribers } = await DripService.fetchSubscriber({
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
