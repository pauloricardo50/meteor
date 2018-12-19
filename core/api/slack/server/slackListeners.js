import { Meteor } from 'meteor/meteor';

import ServerEventService from '../../events/server/ServerEventService';
import {
  inviteUserToPromotion,
  bookPromotionLot,
  sellPromotionLot,
} from '../../methods';
import SlackService from '../SlackService';
import PromotionService from '../../promotions/PromotionService';
import PromotionLotService from '../../promotionLots/PromotionLotService';
import UserService from '../../users/UserService';
import LoanService from '../../loans/LoanService';
import { simpleUserFragment } from 'imports/core/api/users/queries/userFragments/index';

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

ServerEventService.addMethodListener(
  bookPromotionLot,
  ({ promotionLotId, loanId }) => {
    const {
      name: lotName,
      promotion: { name, assignedEmployee, _id: promotionId },
    } = PromotionLotService.createQuery({
      $filters: { _id: promotionLotId },
      name: 1,
      promotion: { name: 1, assignedEmployee: simpleUserFragment },
    }).fetchOne();
    const { userId } = LoanService.get(loanId);
    const { firstName, lastName } = UserService.get(userId);

    SlackService.notifyAssignee({
      title: `Promotion ${name}`,
      message: `Le lot ${lotName} a été réservé pour ${firstName} ${lastName}`,
      link: `${
        Meteor.settings.public.subdomains.admin
      }/promotions/${promotionId}`,
      assignee: assignedEmployee,
      notifyAlways: true,
    });
  },
);

ServerEventService.addMethodListener(
  sellPromotionLot,
  ({ promotionLotId, loanId }) => {
    const {
      name: lotName,
      promotion: { name, assignedEmployee, _id: promotionId },
    } = PromotionLotService.createQuery({
      $filters: { _id: promotionLotId },
      name: 1,
      promotion: { name: 1, assignedEmployee: simpleUserFragment },
    }).fetchOne();
    const { userId } = LoanService.get(loanId);
    const { firstName, lastName } = UserService.get(userId);

    SlackService.notifyAssignee({
      title: `Promotion ${name}`,
      message: `Le lot ${lotName} a été vendu à ${firstName} ${lastName}`,
      link: `${
        Meteor.settings.public.subdomains.admin
      }/promotions/${promotionId}`,
      assignee: assignedEmployee,
      notifyAlways: true,
    });
  },
);
