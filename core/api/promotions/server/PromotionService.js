import { Meteor } from 'meteor/meteor';

import UserService from '../../users/server/UserService';
import LoanService from '../../loans/server/LoanService';
import FileService from '../../files/server/FileService';
import CollectionService from '../../helpers/CollectionService';
import PropertyService from '../../properties/server/PropertyService';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import {
  PROMOTION_STATUS,
  PROMOTION_PERMISSIONS_FULL_ACCESS,
} from '../../constants';
import { sendEmail } from '../../email/methodDefinitions';
import { EMAIL_IDS } from '../../email/emailConstants';
import { PROPERTY_CATEGORY } from '../../properties/propertyConstants';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import Promotions from '../promotions';

export class PromotionService extends CollectionService {
  constructor() {
    super(Promotions);
  }

  insert({ promotion = {}, userId }) {
    if (Meteor.microservice === 'admin') {
      // Don't add any users on a promotion created in admin
      return super.insert(promotion);
    }

    return super.insert({
      ...promotion,
      userLinks: [
        {
          _id: userId,
          permissions: PROMOTION_PERMISSIONS_FULL_ACCESS(),
        },
      ],
    });
  }

  insertPromotionProperty({ promotionId, property }) {
    const { address1, address2, zipCode, city, canton } = this.get(promotionId);
    const propertyId = PropertyService.insert({
      property: {
        ...property,
        address1,
        address2,
        zipCode,
        city,
        canton,
        category: PROPERTY_CATEGORY.PROMOTION,
      },
    });
    const promotionLotId = PromotionLotService.insert({
      propertyLinks: [{ _id: propertyId }],
    });
    this.addLink({
      id: promotionId,
      linkName: 'promotionLots',
      linkId: promotionLotId,
    });
    this.addLink({
      id: promotionId,
      linkName: 'properties',
      linkId: propertyId,
    });

    return promotionLotId;
  }

  update({ promotionId, ...rest }) {
    const result = this._update({ id: promotionId, ...rest });

    const { propertyLinks, ...address } = this.fetchOne({
      $filters: { _id: promotionId },
      propertyLinks: 1,
      address1: 1,
      address2: 1,
      city: 1,
      zipCode: 1,
    });

    propertyLinks.forEach(({ _id }) => {
      PropertyService.update({ propertyId: _id, object: address });
    });

    return result;
  }

  remove({ promotionId }) {
    return super.remove(promotionId);
  }

  inviteUser({
    promotionId,
    user: { email, firstName, lastName, phoneNumber, invitedBy },
    sendInvitation = true,
  }) {
    const promotion = this.get(promotionId);
    const allowAddingUsers = promotion.status === PROMOTION_STATUS.OPEN;

    if (!allowAddingUsers) {
      throw new Meteor.Error("Vous ne pouvez pas inviter de clients lorsque la promotion n'est pas en vente, contactez-nous pour valider la promotion.");
    }

    let userId;
    let isNewUser = false;

    if (!UserService.doesUserExist({ email })) {
      isNewUser = true;
      const admin = UserService.get(promotion.assignedEmployeeId);
      const { organisations = [] } = UserService.fetchOne({
        $filters: { _id: invitedBy },
        organisations: { _id: 1 },
      }) || {};
      const organisationId = organisations.length ? organisations[0]._id : null;

      userId = UserService.adminCreateUser({
        options: {
          email,
          sendEnrollmentEmail: false,
          firstName,
          lastName,
          phoneNumbers: [phoneNumber],
          referredByUserLink: invitedBy,
          referredByOrganisationLink: organisationId,
        },
        adminId: admin && admin._id,
      });
    } else {
      userId = UserService.getByEmail(email)._id;
      if (UserService.hasPromotion({ userId, promotionId })) {
        throw new Meteor.Error('Cet utilisateur est déjà invité à cette promotion');
      }
    }

    const loanId = LoanService.insertPromotionLoan({
      userId,
      promotionId,
      invitedBy,
    });

    if (sendInvitation) {
      return this.sendPromotionInvitationEmail({
        userId,
        isNewUser,
        promotionId,
        firstName,
      }).then(() => loanId);
    }

    return Promise.resolve(loanId);
  }

  sendPromotionInvitationEmail({ userId, isNewUser, promotionId, firstName }) {
    return FileService.listFilesForDocByCategory(promotionId).then(({ promotionImage, logos }) => {
      const coverImageUrl = promotionImage && promotionImage.length > 0 && promotionImage[0].url;
      const logoUrls = logos && logos.map(({ url }) => url);

      let ctaUrl = Meteor.settings.public.subdomains.app;
      const promotion = this.get(promotionId);
      const assignedEmployee = UserService.get(promotion.assignedEmployeeId);

      if (isNewUser) {
        // Envoyer invitation avec enrollment link
        ctaUrl = UserService.getEnrollmentUrl({ userId });
      }

      return sendEmail.run({
        emailId: EMAIL_IDS.INVITE_USER_TO_PROMOTION,
        userId,
        params: {
          promotion: { ...promotion, assignedEmployee },
          coverImageUrl,
          logoUrls,
          ctaUrl,
          name: firstName,
        },
      });
    });
  }

  addProUser({ promotionId, userId }) {
    return this.addLink({
      id: promotionId,
      linkName: 'users',
      linkId: userId,
      metadata: { permissions: {} },
    });
  }

  removeProUser({ promotionId, userId }) {
    const loans = LoanService.fetch({
      $filters: { 'promotionLinks.invitedBy': userId },
    }) || [];
    loans.forEach(({ _id: loanId }) => {
      this.updateLinkMetadata({
        id: promotionId,
        linkName: 'loans',
        linkId: loanId,
        metadata: { invitedBy: undefined },
      });
    });

    return this.removeLink({
      id: promotionId,
      linkName: 'users',
      linkId: userId,
    });
  }

  setUserPermissions({ promotionId, userId, permissions }) {
    return Promotions.update(
      { _id: promotionId, 'userLinks._id': userId },
      { $set: { 'userLinks.$.permissions': permissions } },
    );
  }

  removeUser({ promotionId, loanId }) {
    const loan = LoanService.get(loanId);
    LoanService.removeLink({
      id: loanId,
      linkName: 'promotions',
      linkId: promotionId,
    });

    loan.promotionOptionLinks.forEach(({ _id }) => {
      PromotionOptionService.remove({ promotionOptionId: _id });
    });
  }
}

export default new PromotionService();
