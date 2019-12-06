import { Meteor } from 'meteor/meteor';

import { fullUser } from 'core/api/fragments';
import { HTTP_STATUS_CODES } from '../../RESTAPI/server/restApiConstants';
import UserService from '../../users/server/UserService';
import LoanService from '../../loans/server/LoanService';
import CollectionService from '../../helpers/CollectionService';
import PropertyService from '../../properties/server/PropertyService';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import {
  PROMOTION_STATUS,
  PROMOTION_PERMISSIONS_FULL_ACCESS,
} from '../../constants';
import { PROPERTY_CATEGORY } from '../../properties/propertyConstants';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import SecurityService from '../../security';
import Promotions from '../promotions';

class PromotionService extends CollectionService {
  constructor() {
    super(Promotions);
  }

  insert({ promotion = {}, userId }) {
    const isAdmin = SecurityService.isUserAdmin(userId);
    const promotionId = super.insert(promotion);

    if (userId && !isAdmin) {
      this.addProUser({
        promotionId,
        userId,
        permissions: PROMOTION_PERMISSIONS_FULL_ACCESS(),
      });
    }

    return promotionId;
  }

  insertPromotionProperty({ promotionId, property }) {
    const { address1, address2, zipCode, city, canton } = this.findOne(
      promotionId,
    );
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

    const { propertyLinks = [], ...address } = this.get(promotionId, {
      propertyLinks: 1,
      address1: 1,
      address2: 1,
      city: 1,
      zipCode: 1,
    });

    PropertyService.baseUpdate(
      { _id: { $in: propertyLinks.map(({ _id }) => _id) } },
      { $set: address },
      { multi: true },
    );

    return result;
  }

  remove({ promotionId }) {
    return super.remove(promotionId);
  }

  inviteUser({
    promotionId,
    userId,
    isNewUser,
    pro = {},
    promotionLotIds,
    showAllLots,
    shareSolvency,
  }) {
    this.checkPromotionIsReady({ promotionId });
    const promotion = this.findOne(promotionId);
    const allowAddingUsers = promotion.status === PROMOTION_STATUS.OPEN;

    if (!allowAddingUsers) {
      throw new Meteor.Error(
        "Vous ne pouvez pas inviter de clients lorsque la promotion n'est pas en vente, contactez-nous pour valider la promotion.",
      );
    }

    if (UserService.hasPromotion({ userId, promotionId })) {
      throw new Meteor.Error(
        HTTP_STATUS_CODES.CONFLICT,
        'Ce client est déjà invité à cette promotion',
      );
    }

    const loanId = LoanService.insertPromotionLoan({
      userId,
      promotionId,
      invitedBy: pro._id,
      showAllLots,
      promotionLotIds,
      shareSolvency,
    });

    if (isNewUser) {
      const admin = UserService.get(promotion.assignedEmployeeId, fullUser());
      UserService.assignAdminToUser({ userId, adminId: admin && admin._id });
    }

    return Promise.resolve(loanId);
  }

  addProUser({ promotionId, userId, permissions = {} }) {
    return this.addLink({
      id: promotionId,
      linkName: 'users',
      linkId: userId,
      metadata: { permissions },
    });
  }

  removeProUser({ promotionId, userId }) {
    const loans = LoanService.fetch({
      $filters: {
        'promotionLinks.invitedBy': userId,
        'promotionLinks._id': promotionId,
      },
    });

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

  toggleNotifications({ promotionId, userId }) {
    const promotion = this.get(promotionId, { userLinks: 1 });
    const userLink = promotion.userLinks.find(({ _id }) => _id === userId);
    const nextValue = !userLink.enableNotifications;
    this.updateLinkMetadata({
      id: promotionId,
      linkName: 'users',
      linkId: userId,
      metadata: { enableNotifications: nextValue },
    });
    return nextValue;
  }

  removeLoan({ promotionId, loanId }) {
    const { promotionOptions = [] } = LoanService.get(loanId, {
      promotionOptions: { _id: 1 },
    });

    this.removeLink({
      id: promotionId,
      linkName: 'loans',
      linkId: loanId,
    });

    promotionOptions.forEach(({ _id }) => {
      PromotionLotService.cancelPromotionLotReservation({
        promotionOptionId: _id,
      });
      PromotionOptionService.remove({
        promotionOptionId: _id,
        isLoanRemoval: true,
      });
    });
  }

  editPromotionLoan({
    loanId,
    promotionId,
    promotionLotIds = [],
    showAllLots,
  }) {
    if (showAllLots !== undefined) {
      this.updateLinkMetadata({
        id: promotionId,
        linkName: 'loans',
        linkId: loanId,
        metadata: { showAllLots },
      });
    }

    const { promotionOptions = [] } = LoanService.get(loanId, {
      promotionOptions: {
        promotionLots: { attributedTo: { _id: 1 }, name: 1 },
      },
    });

    // Add any new promotionOptions if they don't already exist
    promotionLotIds.forEach(promotionLotId => {
      const existingPromotionOption = promotionOptions.find(
        ({ promotionLots: promotionOptionLots }) =>
          promotionOptionLots[0]._id === promotionLotId,
      );

      if (!existingPromotionOption) {
        PromotionOptionService.insert({ promotionLotId, loanId, promotionId });
      }
    });

    // Remove all promotionOptions that aren't in the specified array
    const promotionOptionsToRemove = promotionOptions.filter(
      ({ promotionLots }) => promotionLotIds.indexOf(promotionLots[0]._id) < 0,
    );

    promotionOptionsToRemove.forEach(promotionOption => {
      // Try to remove this promotion option
      const { promotionLots, _id: promotionOptionId } = promotionOption;
      const { attributedTo, name } = promotionLots[0];

      if (attributedTo && attributedTo._id === loanId) {
        throw new Meteor.Error(
          `Vous ne pouvez pas supprimer le lot "${name}" de ce client, car il lui est attribué.`,
        );
      }

      PromotionOptionService.remove({ promotionOptionId });
    });
  }

  reuseConstructionTimeline({ fromPromotionId, toPromotionId }) {
    const { constructionTimeline } = this.get(fromPromotionId, {
      constructionTimeline: 1,
    });

    return this.update({
      promotionId: toPromotionId,
      object: { constructionTimeline },
    });
  }

  updateUserRoles({ promotionId, userId, roles = [] }) {
    this.updateLinkMetadata({
      id: promotionId,
      linkName: 'users',
      linkId: userId,
      metadata: { roles },
    });
  }

  checkPromotionIsReady({ promotionId }) {
    const {
      documents = {},
      promotionLotLinks = [],
      assignedEmployeeId,
      name,
      city,
      zipCode,
    } = this.findOne(promotionId);

    if (!name || !city || !zipCode) {
      throw new Meteor.Error(
        'Il faut ajouter un nom et une addresse à cette promotion',
      );
    }

    if (promotionLotLinks.length === 0) {
      throw new Meteor.Error('Il faut ajouter des lots sur une promotion');
    }

    if (!assignedEmployeeId) {
      throw new Meteor.Error(
        'Il faut assigner un conseiller à cette promotion',
      );
    }

    if (
      !Meteor.isTest &&
      !Meteor.isAppTest &&
      (!documents.promotionGuide ||
        !documents.promotionGuide.length ||
        documents.promotionGuide.length !== 1)
    ) {
      throw new Meteor.Error(
        'Il faut ajouter un (seul) guide du financement bancaire sur cette promotion',
      );
    }
  }

  setStatus({ promotionId, status }) {
    if (status === PROMOTION_STATUS.OPEN) {
      this.checkPromotionIsReady({ promotionId });
    }

    return this.update({ promotionId, object: { status } });
  }
}

export default new PromotionService();
