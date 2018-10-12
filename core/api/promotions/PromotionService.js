import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Promotions from './promotions';
import { PROMOTION_USER_PERMISSIONS } from './promotionConstants';
import UserService from '../users/UserService';
import LoanService from '../loans/LoanService';
import CollectionService from '../helpers/CollectionService';
import PropertyService from '../properties/PropertyService';
import PromotionLotService from '../promotionLots/PromotionLotService';
import { ROLES } from '../users/userConstants';

export class PromotionService extends CollectionService {
  constructor() {
    super(Promotions);
  }

  insert({ promotion = {}, userId }) {
    return super.insert({
      ...promotion,
      userLinks: [
        {
          _id: userId,
          permissions: PROMOTION_USER_PERMISSIONS.MODIFY,
        },
      ],
    });
  }

  insertPromotionProperty({ promotionId, property }) {
    const propertyId = PropertyService.insert({ property });
    const promotionLotId = PromotionLotService.insert({
      propertyLinks: [{ _id: propertyId }],
    });
    this.addLink({
      id: promotionId,
      linkName: 'promotionLotLinks',
      linkId: promotionLotId,
    });
    this.addLink({
      id: promotionId,
      linkName: 'propertyLinks',
      linkId: propertyId,
    });

    return promotionLotId;
  }

  update({ promotionId, ...rest }) {
    return super.update({ id: promotionId, ...rest });
  }

  remove({ promotionId }) {
    return super.remove(promotionId);
  }

  inviteUser({
    promotionId,
    user: { email, firstName, lastName, phoneNumber },
  }) {
    let userId;
    let isNewUser = false;

    if (!UserService.doesUserExist({ email })) {
      isNewUser = true;
      const yannisUser = Accounts.findUserByEmail('yannis@e-potek.ch');
      userId = UserService.adminCreateUser({
        options: {
          email,
          sendEnrollmentEmail: false,
          firstName,
          lastName,
          phoneNumbers: [phoneNumber],
        },
        role: ROLES.USER,
        adminId: yannisUser && yannisUser._id,
      });
    } else {
      userId = Accounts.findUserByEmail(email)._id;
    }

    if (UserService.hasPromotion({ userId, promotionId })) {
      throw new Meteor.Error('This user was already invited to this promotion');
    }
    const loanId = LoanService.insertPromotionLoan({ userId, promotionId });
    this.sendPromotionInvitationEmail({ email, isNewUser, promotionId });
    return loanId;
  }

  sendPromotionInvitationEmail({ email, isNewUser, promotionId }) {
    if (isNewUser) {
      // Envoyer invitation avec enrollment link
    } else {
      // Envoyer invitation sans enrollment link
    }
  }
}

export default new PromotionService();
