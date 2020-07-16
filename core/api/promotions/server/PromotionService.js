import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import CollectionService from '../../helpers/server/CollectionService';
import { LOAN_STATUS } from '../../loans/loanConstants';
import LoanService from '../../loans/server/LoanService';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import { PROPERTY_CATEGORY } from '../../properties/propertyConstants';
import PropertyService from '../../properties/server/PropertyService';
import { HTTP_STATUS_CODES } from '../../RESTAPI/server/restApiConstants';
import SecurityService from '../../security';
import AssigneeService from '../../users/server/AssigneeService';
import UserService from '../../users/server/UserService';
import {
  PROMOTION_PERMISSIONS_FULL_ACCESS,
  PROMOTION_STATUS,
} from '../promotionConstants';
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
    const { address1, address2, zipCode, city, canton } = this.get(
      promotionId,
      { address1: 1, address2: 1, zipCode: 1, city: 1, canton: 1 },
    );
    const { promotionLotGroupIds } = property;

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
      promotionLotGroupIds,
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
    pro = {},
    promotionLotIds,
    showAllLots,
    shareSolvency,
    skipCheckPromotionIsReady = false,
  }) {
    if (!skipCheckPromotionIsReady) {
      this.checkPromotionIsReady({ promotionId });
    }
    const promotion = this.get(promotionId, {
      status: 1,
      assignedEmployeeId: 1,
    });
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

    return loanId;
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

    if (loans?.length) {
      throw new Meteor.Error(
        'Ce compte Pro a toujours des clients dans cette promotion.',
      );
    }

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
    } = this.get(promotionId, {
      documents: 1,
      promotionLotLinks: 1,
      assignedEmployeeId: 1,
      name: 1,
      city: 1,
      zipCode: 1,
    });

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
      !Meteor.isDevelopment &&
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

    if (
      !Meteor.isDevelopment &&
      !Meteor.isTest &&
      !Meteor.isAppTest &&
      !documents.promotionImage?.length
    ) {
      throw new Meteor.Error('Il faut ajouter une image sur cette promotion');
    }
  }

  setStatus({ promotionId, status }) {
    if (status === PROMOTION_STATUS.OPEN) {
      this.checkPromotionIsReady({ promotionId });
    }

    return this.update({ promotionId, object: { status } });
  }

  addPromotionLotGroup({ promotionId, promotionLotGroup }) {
    const { promotionLotGroups = [] } = this.get(promotionId, {
      promotionLotGroups: 1,
    });

    if (
      promotionLotGroups.some(({ label }) => label === promotionLotGroup.label)
    ) {
      throw new Meteor.Error(
        `Le groupe "${promotionLotGroup.label}" existe déjà`,
      );
    }

    const id = Random.id();

    return this._update({
      id: promotionId,
      object: {
        promotionLotGroups: [
          ...promotionLotGroups,
          { id, ...promotionLotGroup },
        ],
      },
    });
  }

  removePromotionLotGroup({ promotionId, promotionLotGroupId }) {
    const { promotionLotGroups = [], promotionLots = [] } = this.get(
      promotionId,
      {
        promotionLotGroups: 1,
        promotionLots: { promotionLotGroupIds: 1 },
      },
    );

    const groupToRemove = promotionLotGroups.find(
      ({ id }) => id === promotionLotGroupId,
    );

    if (!groupToRemove) {
      throw new Meteor.Error(
        `PromotionLotGroup id "${promotionLotGroupId}" not found`,
      );
    }

    const promotionLotsInGroup = promotionLots.filter(
      ({ promotionLotGroupIds = [] }) =>
        promotionLotGroupIds.some(id => id === promotionLotGroupId),
    );

    if (promotionLotsInGroup.length) {
      promotionLotsInGroup.forEach(({ _id: promotionLotId }) =>
        PromotionLotService.removeFromPromotionLotGroup({
          promotionLotId,
          promotionLotGroupId,
        }),
      );
    }

    const newGroups = promotionLotGroups.filter(
      ({ id }) => id !== promotionLotGroupId,
    );

    return this._update({
      id: promotionId,
      object: { promotionLotGroups: newGroups },
    });
  }

  updatePromotionLotGroup({ promotionId, promotionLotGroupId, object }) {
    const { promotionLotGroups = [] } = this.get(promotionId, {
      promotionLotGroups: 1,
    });

    const groupToUpdate = promotionLotGroups.find(
      ({ id }) => id === promotionLotGroupId,
    );

    if (!groupToUpdate) {
      throw new Meteor.Error(
        `PromotionLotGroup id "${promotionLotGroupId}" not found`,
      );
    }

    const newGroups = promotionLotGroups;
    newGroups[newGroups.findIndex(({ id }) => id === groupToUpdate.id)] = {
      id: groupToUpdate.id,
      ...object,
    };

    return this._update({
      id: promotionId,
      object: { promotionLotGroups: newGroups },
    });
  }

  updatePromotionTimeline({ promotionId, constructionTimeline }) {
    const { signingDate } = this.get(promotionId, { signingDate: 1 });
    const {
      startPercent,
      endPercent,
      steps = [],
      endDate,
    } = constructionTimeline;

    const stepPercent = steps.reduce((tot, { percent }) => tot + percent, 0);
    const total = Math.round((startPercent + endPercent + stepPercent) * 100);

    if (endDate && endPercent && steps.length === 0) {
      throw new Meteor.Error('Il faut ajouter les étapes du chantier');
    }

    if (total !== 100) {
      throw new Meteor.Error(
        `Les étapes doivent s'additionner à 100% (actuellement ${total}%)`,
      );
    }

    const firstDate = new Date(steps[0]?.startDate);
    const lastDate = new Date(steps.slice(-1)[0].startDate);

    if (signingDate && signingDate.getTime() > firstDate.getTime()) {
      throw new Meteor.Error(
        'La date de signature ne peut pas être après le début de la construction',
      );
    }

    if (new Date(endDate).getTime() < lastDate.getTime()) {
      throw new Meteor.Error(
        'La fin de la construction doit être après la dernière étape',
      );
    }

    steps.forEach(({ startDate }, index) => {
      if (index > 0) {
        const prevDate = steps[index - 1].startDate;
        if (new Date(prevDate).getTime() > new Date(startDate).getTime()) {
          throw new Meteor.Error(
            "Chaque date consécutive doit venir après l'autre",
          );
        }
      }
    });

    this.update({ promotionId, object: { constructionTimeline } });
  }

  attachLoanToPromotion({
    loanId,
    promotionId,
    invitedBy,
    showAllLots,
    promotionLotIds = [],
  }) {
    const {
      hasPromotion,
      lenders,
      properties = [],
      status,
      userId,
    } = LoanService.get(loanId, {
      adminNotes: 1,
      hasPromotion: 1,
      lenders: { offers: { _id: 1 } },
      properties: { _id: 1 },
      status: 1,
      userId: 1,
    });

    if (
      [
        LOAN_STATUS.CLOSING,
        LOAN_STATUS.BILLING,
        LOAN_STATUS.FINALIZED,
        LOAN_STATUS.UNSUCCESSFUL,
      ].includes(status)
    ) {
      throw new Meteor.Error(
        HTTP_STATUS_CODES.BAD_REQUEST,
        'Pas possible pour les dossiers en closing et +',
      );
    }

    if (hasPromotion) {
      throw new Meteor.Error(
        HTTP_STATUS_CODES.CONFLICT,
        'Loan is already on a promotion',
      );
    }

    if (!userId) {
      throw new Meteor.Error(
        HTTP_STATUS_CODES.BAD_REQUEST,
        'Loan needs a user account',
      );
    }

    if (UserService.hasPromotion({ userId, promotionId })) {
      throw new Meteor.Error(
        HTTP_STATUS_CODES.CONFLICT,
        'Ce client est déjà invité à cette promotion',
      );
    }

    if (lenders?.length && lenders.some(({ offers = [] }) => offers.length)) {
      throw new Meteor.Error(
        HTTP_STATUS_CODES.CONFLICT,
        "Il reste des offres sur ce dossier, veuillez les supprimer d'abord",
      );
    }

    this.checkPromotionIsReady({ promotionId });

    this.addLink({
      id: promotionId,
      linkName: 'loans',
      linkId: loanId,
      metadata: { invitedBy, showAllLots },
    });

    promotionLotIds.forEach(promotionLotId => {
      PromotionOptionService.insert({ promotionLotId, loanId, promotionId });
    });

    LoanService.baseUpdate(
      loanId,
      {
        $set: {
          structures: [],
          selectedStructure: '',
          'adminNotes.$[].isSharedWithPros': false,
        },
        $unset: { maxPropertyValue: 1 },
      },
      // Fails because of simple schema: https://github.com/aldeed/simpl-schema/issues/378
      { bypassCollection2: true },
    );

    properties.forEach(({ _id: propertyId }) => {
      LoanService.removeLink({
        id: loanId,
        linkName: 'properties',
        linkId: propertyId,
      });
    });

    LoanService.addNewStructure({ loanId });
  }
}

export default new PromotionService();
