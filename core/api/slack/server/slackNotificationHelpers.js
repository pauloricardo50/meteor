import PropertyService from '../../properties/server/PropertyService';

import { propertyInviteNotification } from './slackNotifications';

export const sendPropertyInvitations = (
  propertyIds,
  currentUser,
  invitedUser,
) => {
  propertyIds.forEach(id => {
    const property = PropertyService.fetchOne({
      $filters: { $or: [{ _id: id }, { externalId: id }] },
      address1: 1,
    });
    propertyInviteNotification({
      currentUser,
      user: invitedUser,
      property,
    });
  });
};
