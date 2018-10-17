import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import Promotions from './promotions';
import {
  PROMOTION_USER_PERMISSIONS,
  PROMOTION_STATUS,
} from './promotionConstants';
import UserService from '../users/UserService';
import LoanService from '../loans/LoanService';
import FileService from '../files/server/FileService';
import CollectionService from '../helpers/CollectionService';
import PropertyService from '../properties/PropertyService';
import PromotionLotService from '../promotionLots/PromotionLotService';
import { ROLES } from '../users/userConstants';
import { sendEmail } from '..';
import { EMAIL_IDS } from '../email/emailConstants';

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
    return this._update({ id: promotionId, ...rest });
  }

  remove({ promotionId }) {
    return super.remove(promotionId);
  }

  inviteUser({
    promotionId,
    user: { email, firstName, lastName, phoneNumber },
  }) {
    const promotion = this.get(promotionId);

    if (promotion.status !== PROMOTION_STATUS.OPEN) {
      throw new Meteor.Error("Vous ne pouvez pas inviter de clients lorsque la promotion n'est pas en vente, contactez-nous pour valider la promotion.");
    }

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
      throw new Meteor.Error('Cet utilisateur est déjà invité à cette promotion');
    }
    const loanId = LoanService.insertPromotionLoan({ userId, promotionId });
    this.sendPromotionInvitationEmail({
      userId,
      email,
      isNewUser,
      promotionId,
      firstName,
    });
    return loanId;
  }

  sendPromotionInvitationEmail({
    userId,
    email,
    isNewUser,
    promotionId,
    firstName,
  }) {
    return FileService.listFilesForDocByCategory(promotionId).then(({ promotionImage, logos }) => {
      const coverImageUrl = promotionImage && promotionImage[0] && promotionImage[0].url;
      const logoUrls = logos && logos.map(({ url }) => url);

      let ctaUrl = Meteor.settings.public.subdomains.app;
      const { name } = this.get(promotionId);

      if (isNewUser) {
        // Envoyer invitation avec enrollment link
        const { token } = Accounts.generateResetToken(
          userId,
          email,
          'enrollAccount',
        );
        ctaUrl = `${
          Meteor.settings.public.subdomains.app
        }/enroll-account/${token}`;
      }

      // Envoyer invitation sans enrollment link
      return sendEmail.run({
        emailId: EMAIL_IDS.INVITE_USER_TO_PROMOTION,
        userId,
        params: {
          promotionName: name,
          coverImageUrl,
          logoUrls,
          ctaUrl,
          name: firstName,
        },
      });
    });
  }
}

export default new PromotionService();
