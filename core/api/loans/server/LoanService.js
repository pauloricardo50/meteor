import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import formatMessage from 'core/utils/intl';
import {
  makeFeedback,
  FEEDBACK_OPTIONS,
} from 'core/components/OfferList/feedbackHelpers';
import OfferService from '../../offers/server/OfferService';
import { adminLoan } from '../../fragments';
import CollectionService from '../../helpers/CollectionService';
import BorrowerService from '../../borrowers/server/BorrowerService';
import PropertyService from '../../properties/server/PropertyService';
import { LOAN_STATUS, LOAN_VERIFICATION_STATUS } from '../loanConstants';
import Loans from '../loans';

// Pads a number with zeros: 4 --> 0004
const zeroPadding = (num, places) => {
  const zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
};

export class LoanService extends CollectionService {
  constructor() {
    super(Loans);
  }

  insert = ({ loan = {}, userId }) =>
    Loans.insert({ ...loan, name: this.getNewLoanName(), userId });

  getNewLoanName = (now = new Date()) => {
    const year = now.getYear();
    const yearPrefix = year - 100;
    const lastLoan = Loans.findOne({}, { sort: { name: -1 } });
    if (!lastLoan) {
      return `${yearPrefix}-0001`;
    }
    const [lastPrefix, count] = lastLoan.name
      .split('-')
      .map(numb => parseInt(numb, 10));

    if (lastPrefix !== yearPrefix) {
      return `${yearPrefix}-0001`;
    }

    const nextCountString = zeroPadding(count + 1, 4);

    return `${yearPrefix}-${nextCountString}`;
  };

  update = ({ loanId, object, operator = '$set' }) =>
    Loans.update(loanId, { [operator]: object });

  remove = ({ loanId }) => Loans.remove(loanId);

  adminLoanInsert = ({ userId }) => {
    const borrowerId = BorrowerService.insert({ userId });
    const loanId = this.insert({ loan: { borrowerIds: [borrowerId] }, userId });
    this.addNewStructure({ loanId });
    return loanId;
  };

  askVerification = ({ loanId }) => {
    const loan = this.get(loanId);

    if (
      loan.verificationStatus === LOAN_VERIFICATION_STATUS.REQUESTED
      || loan.verificationStatus === LOAN_VERIFICATION_STATUS.OK
    ) {
      // Don't do anything if this loan is already in requested mode
      throw new Meteor.Error('La demande est déjà en cours, ou effectuée.');
    }

    return this.update({
      loanId,
      object: {
        verificationStatus: LOAN_VERIFICATION_STATUS.REQUESTED,
        userFormsEnabled: false,
      },
    });
  };

  insertPromotionLoan = ({ userId, promotionId, invitedBy }) => {
    const borrowerId = BorrowerService.insert({ userId });
    const loanId = this.insert({
      loan: {
        borrowerIds: [borrowerId],
        promotionLinks: [{ _id: promotionId, invitedBy }],
      },
      userId,
    });

    this.addNewStructure({ loanId });

    return loanId;
  };

  insertPropertyLoan = ({ userId, propertyId }) => {
    const borrowerId = BorrowerService.insert({ userId });
    const loanId = this.insert({
      loan: { borrowerIds: [borrowerId], propertyIds: [propertyId] },
      userId,
    });
    this.addNewStructure({ loanId });
    return loanId;
  };

  confirmClosing = ({ loanId, object }) =>
    this.update({
      loanId,
      object: { status: LOAN_STATUS.BILLING, ...object },
    });

  pushValue = ({ loanId, object }) => Loans.update(loanId, { $push: object });

  popValue = ({ loanId, object }) => Loans.update(loanId, { $pop: object });

  pullValue = ({ loanId, object }) => Loans.update(loanId, { $pull: object });

  addStructure = ({ loanId, structure, atIndex }) => {
    const newStructureId = Random.id();
    Loans.update(loanId, {
      $push: {
        structures: {
          $each: [{ ...structure, id: newStructureId }],
          $position: atIndex,
        },
      },
    });
    return newStructureId;
  };

  addNewStructure = ({ loanId, structure }) => {
    const { structures, selectedStructure, propertyIds } = this.get(loanId);
    const isFirstStructure = structures.length === 0;
    const shouldCopyExistingStructure = !isFirstStructure && !structure && selectedStructure;

    if (shouldCopyExistingStructure) {
      structure = structures.find(({ id }) => selectedStructure === id);
    }

    const propertyId = (structure && structure.propertyId)
      || (propertyIds.length > 0 ? propertyIds[0] : undefined);
    const newStructureId = this.addStructure({
      loanId,
      structure: {
        ...structure,
        name: `Plan financier ${structures.length + 1}`,
        propertyId,
      },
    });
    this.update({
      loanId,
      object: isFirstStructure ? { selectedStructure: newStructureId } : {},
    });

    return newStructureId;
  };

  removeStructure = ({ loanId, structureId }) => {
    const { selectedStructure: currentlySelected } = this.get(loanId);

    if (currentlySelected !== structureId) {
      const updateObj = {
        $pull: { structures: { id: structureId } },
      };

      return Loans.update(loanId, updateObj, {
        // Edge case fix: https://github.com/meteor/meteor/issues/4342
        getAutoValues: false,
      });
    }

    throw new Meteor.Error('Vous ne pouvez pas supprimer votre plan financier choisi');
  };

  updateStructure = ({ loanId, structureId, structure }) => {
    const currentStructure = this.get(loanId).structures.find(({ id }) => id === structureId);

    return Loans.update(
      { _id: loanId, 'structures.id': structureId },
      { $set: { 'structures.$': { ...currentStructure, ...structure } } },
    );
  };

  selectStructure = ({ loanId, structureId }) => {
    // Make sure the structure exists
    const structureExists = this.get(loanId).structures.some(({ id }) => id === structureId);

    if (structureExists) {
      return this.update({
        loanId,
        object: { selectedStructure: structureId },
      });
    }

    throw new Meteor.Error(`Structure with id "${structureId}" does not exist`);
  };

  duplicateStructure = ({ loanId, structureId }) => {
    const { structures } = this.get(loanId);
    const currentStructure = structures.find(({ id }) => id === structureId);
    const currentStructureIndex = structures.findIndex(({ id }) => id === structureId);

    return (
      !!currentStructure
      && this.addStructure({
        loanId,
        structure: {
          ...currentStructure,
          name: `${currentStructure.name || 'Plan financier'} - copie`,
          disabled: false,
        },
        atIndex: currentStructureIndex + 1,
      })
    );
  };

  addPropertyToLoan = ({ loanId, propertyId }) => {
    this.pushValue({ loanId, object: { propertyIds: propertyId } });
  };

  cleanupRemovedBorrower = ({ borrowerId }) => {
    // Remove all references to this borrower on the loan
    const loans = Loans.find({ borrowerIds: borrowerId }).fetch();
    loans.forEach((loan) => {
      this.update({
        loanId: loan._id,
        object: {
          structures: loan.structures.map(structure => ({
            ...structure,
            ownFunds: structure.ownFunds.filter(({ borrowerId: bId }) => bId !== borrowerId),
          })),
        },
      });
    });
  };

  setPromotionPriorityOrder({ loanId, promotionId, priorityOrder }) {
    return Loans.update(
      { _id: loanId, 'promotionLinks._id': promotionId },
      { $set: { 'promotionLinks.$.priorityOrder': priorityOrder } },
    );
  }

  getPromotionPriorityOrder({ loanId, promotionId }) {
    const promotionLink = this.get(loanId).promotionLinks.find(({ _id }) => _id === promotionId);
    return promotionLink ? promotionLink.priorityOrder : [];
  }

  assignLoanToUser({ loanId, userId }) {
    const {
      propertyIds = [],
      borrowerIds = [],
      properties = [],
      borrowers = [],
    } = this.fetchOne({
      $filters: { _id: loanId },
      propertyIds: 1,
      borrowerIds: 1,
      properties: { loans: { _id: 1 }, address1: 1 },
      borrowers: { loans: { _id: 1 }, name: 1 },
    });

    borrowers.forEach(({ loans = [], name }) => {
      if (loans.length > 1) {
        throw new Meteor.Error(`Peut pas réassigner l'hypothèque, l'emprunteur "${name}" est assigné à plus d'une hypothèque`);
      }
    });
    properties.forEach(({ loans = [], address1 }) => {
      if (loans.length > 1) {
        throw new Meteor.Error(`Peut pas réassigner l'hypothèque, le bien immobilier "${address1}" est assigné à plus d'une hypothèque`);
      }
    });

    const object = { userId };

    this.update({ loanId, object });
    propertyIds.forEach((propertyId) => {
      PropertyService.update({ propertyId, object });
    });
    borrowerIds.forEach((borrowerId) => {
      BorrowerService.update({ borrowerId, object });
    });
  }

  switchBorrower({ loanId, borrowerId, oldBorrowerId }) {
    const { borrowerIds } = this.get(loanId);
    const { loans: oldBorrowerLoans = [] } = BorrowerService.createQuery({
      $filters: { _id: oldBorrowerId },
      loans: { name: 1 },
    }).fetchOne();

    if (borrowerIds.includes(borrowerId)) {
      throw new Meteor.Error('Cet emprunteur est déjà sur ce prêt hypothécaire');
    }

    this.update({
      loanId,
      object: {
        borrowerIds: borrowerIds.map(id =>
          (id === oldBorrowerId ? borrowerId : id)),
      },
    });

    if (oldBorrowerLoans.length === 1 && oldBorrowerLoans[0]._id === loanId) {
      BorrowerService.remove({ borrowerId: oldBorrowerId });
    }
  }

  sendNegativeFeedbackToAllLenders({ loanId }) {
    const {
      offers = [],
      structure: { property },
    } = this.createQuery({
      $filters: { _id: loanId },
      ...adminLoan({ withSort: true }),
      $options: { sort: { createdAt: -1 } },
    }).fetchOne() || {};

    // Get lenders' last offer
    const filteredOffers = offers.reduce((filtered, offer) => {
      const {
        lender: {
          contact: { email: lenderEmail },
        },
      } = offer;

      const lenderIsAlreadyInMailingList = filtered.find(({
        lender: {
          contact: { email },
        },
      }) => lenderEmail === email);

      if (lenderIsAlreadyInMailingList) {
        return filtered;
      }

      return [...filtered, offer];
    }, []);

    const promises = filteredOffers.map((offer) => {
      const feedback = makeFeedback({
        offer: { ...offer, property },
        model: { option: FEEDBACK_OPTIONS.NEGATIVE_WITHOUT_FOLLOW_UP },
        formatMessage,
      });
      return OfferService.sendFeedback({
        offerId: offer._id,
        feedback,
        saveFeedback: false,
      });
    });

    return Promise.all(promises);
  }

  updatePromotionInvitedBy({ loanId, promotionId, invitedBy }) {
    this.updateLinkMetadata({
      id: loanId,
      linkName: 'promotions',
      linkId: promotionId,
      metadata: { invitedBy },
    });
  }

  reuseProperty({ loanId, propertyId }) {
    const loan = this.get(loanId);

    if (loan.propertyIds.includes(propertyId)) {
      return false;
    }

    this.addLink({ id: loanId, linkName: 'properties', linkId: propertyId });
  }
}

export default new LoanService({});
