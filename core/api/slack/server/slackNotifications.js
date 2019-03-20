import { Meteor } from 'meteor/meteor';

import SlackService from './SlackService';

export const referralOnlyNotification = ({ currentUser, user }) => {
  const { _id: userId, name } = user;
  SlackService.notifyAssignee({
    currentUser,
    link: `${Meteor.settings.public.subdomains.admin}/users/${userId}`,
    title: `${name} a été invité sur e-Potek en referral uniquement"`,
  });
};

export const propertyInviteNotification = ({ currentUser, property, user }) => {
  const { _id: userId, firstName, lastName } = user;
  const { address1 } = property;

  SlackService.notifyAssignee({
    currentUser,
    link: `${Meteor.settings.public.subdomains.admin}/users/${userId}`,
    title: `${firstName} ${lastName} a été invité au bien immo: "${address1}"`,
  });
};

export const promotionInviteNotification = ({
  promotion: { name, assignedEmployee, _id: promotionId },
  user,
}) => {
  const { firstName, lastName, email } = user;

  SlackService.notifyAssignee({
    title: `Promotion ${name}`,
    message: `${firstName} ${lastName} a été invité! ${email}`,
    link: `${
      Meteor.settings.public.subdomains.admin
    }/promotions/${promotionId}`,
    assignee: assignedEmployee,
    notifyAlways: true,
  });
};

export const promotionLotBooked = ({ promotionLot, user: { name } }) => {
  const {
    name: lotName,
    promotion: { name: promotionName, assignedEmployee, _id: promotionId },
  } = promotionLot;

  SlackService.notifyAssignee({
    title: `Promotion ${promotionName}`,
    message: `Le lot ${lotName} a été réservé pour ${name}`,
    link: `${
      Meteor.settings.public.subdomains.admin
    }/promotions/${promotionId}`,
    assignee: assignedEmployee,
    notifyAlways: true,
  });
};

export const promotionLotSold = ({ promotionLot, user: { name } }) => {
  const {
    name: lotName,
    promotion: { name: promotionName, assignedEmployee, _id: promotionId },
  } = promotionLot;

  SlackService.notifyAssignee({
    title: `Promotion ${promotionName}`,
    message: `Le lot ${lotName} a été vendu à ${name}`,
    link: `${
      Meteor.settings.public.subdomains.admin
    }/promotions/${promotionId}`,
    assignee: assignedEmployee,
    notifyAlways: true,
  });
};

export const updateWatcherNotification = ({
  user,
  title,
  collection,
  docId,
  message,
}) => {
  SlackService.notifyAssignee({
    currentUser: user,
    title,
    link: `${Meteor.settings.public.subdomains.admin}/${collection}/${docId}`,
    message,
  });
};
