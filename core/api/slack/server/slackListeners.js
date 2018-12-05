import { Meteor } from 'meteor/meteor';

import ServerEventService from '../../events/server/ServerEventService';
import { inviteUserToPromotion } from '../../methods';
import SlackService from '../SlackService';
import PromotionService from '../../promotions/PromotionService';
import UserService from '../../users/UserService';

ServerEventService.addMethodListener(
  inviteUserToPromotion,
  ({ promotionId, user }) => {
    const { name, assignedEmployeeId } = PromotionService.get(promotionId);
    const { firstName, lastName, email } = user;
    const assignee = UserService.get(assignedEmployeeId);

    SlackService.notifyAssignee({
      title: `Promotion ${name}`,
      message: `${firstName} ${lastName} a été invité! ${email}`,
      link: `${
        Meteor.settings.public.subdomains.admin
      }/promotions/${promotionId}`,
      assignee,
      notifyAlways: true,
    });
  },
);
