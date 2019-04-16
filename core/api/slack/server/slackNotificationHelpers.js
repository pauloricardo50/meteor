import PropertyService from '../../properties/server/PropertyService';
import PromotionService from '../../promotions/server/PromotionService';

import {
  promotionInviteNotification,
  propertyInviteNotification,
} from './slackNotifications';

export const sendPropertyInvitations = (
  propertyIds,
  currentUser,
  invitedUser,
) => {
  propertyIds.forEach((id) => {
    const property = PropertyService.get(id);
    propertyInviteNotification({
      currentUser,
      user: invitedUser,
      property,
    });
  });
};

export const sendPromotionInvitations = (
  promotionIds,
  currentUser,
  invitedUser,
) => {
  promotionIds.forEach((id) => {
    const promotion = PromotionService.fetchOne({
      $filters: { _id: id },
      name: 1,
      assignedEmployee: { email: 1 },
    });
    promotionInviteNotification({ currentUser, promotion, user: invitedUser });
  });
};
