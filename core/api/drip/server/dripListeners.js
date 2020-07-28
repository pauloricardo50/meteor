import { Meteor } from 'meteor/meteor';

import { employeesByEmail } from '../../../arrays/epotekEmployees';
import { ACTIVITY_TYPES } from '../../activities/activityConstants';
import ActivityService from '../../activities/server/ActivityService';
import { analyticsVerifyEmail } from '../../analytics/methodDefinitions';
import ServerEventService from '../../events/server/ServerEventService';
import LoanService from '../../loans/server/LoanService';
import { removeLoanFromPromotion } from '../../promotions/methodDefinitions';
import {
  adminCreateUser,
  anonymousCreateUser,
  assignAdminToUser,
  changeEmail,
  proInviteUser,
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
      user: { email, status },
    },
  }) => {
    if (status === USER_STATUS.PROSPECT) {
      DripService.createSubscriber({ email });
    }
  },
);

ServerEventService.addAfterMethodListener(
  [userVerifyEmail, analyticsVerifyEmail],
  ({ context }) => {
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
  async ({ params: { userId }, result: { oldEmail, newEmail } }) => {
    const bounced = ActivityService.fetch({
      $filters: {
        'userLink._id': userId,
        type: ACTIVITY_TYPES.DRIP,
        'metadata.dripStatus': 'bounced',
      },
      _id: 1,
    });

    // If old email bounced once with drip
    // Remove the old subscriber and create a new one (start from scratch)
    // Otherwise update the subscriber email
    try {
      if (bounced?.length) {
        await DripService.removeSubscriber({ email: oldEmail });
        await DripService.createSubscriber({ email: newEmail });
      } else {
        const { subscribers = [] } = await DripService.fetchSubscriber({
          subscriber: { email: oldEmail },
        });
        const [subscriber] = subscribers;
        DripService.upsertSubscriber({
          subscriber: { id: subscriber?.id, email: newEmail },
        });
      }
    } catch (error) {
      //
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

    // If subscriber already received a drip
    // do nothing
    // Otherwise update the subscriber's assignee data
    const dripActivity = ActivityService.fetch({
      $filters: {
        'userLink._id': userId,
        type: ACTIVITY_TYPES.DRIP,
        'metadata.dripStatus': 'received',
      },
      _id: 1,
    });

    if (dripActivity?.length) {
      return;
    }

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
  removeLoanFromPromotion,
  ({ params: { loanId } }) => {
    const { user } = LoanService.get(loanId, { user: { email: 1 } });

    DripService.trackEvent({
      event: { action: DRIP_ACTIONS.LOAN_REMOVED_FROM_PROMOTION },
      email: user?.email,
    });
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
        return DripService.tagSubscriber({
          subscriber: { email },
          tag: DripService.tags.LOST,
        });
      }

      default:
        return undefined;
    }
  },
);
