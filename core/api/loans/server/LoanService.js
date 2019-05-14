import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import omit from 'lodash/omit';
import moment from 'moment';

import LenderRulesService from 'core/api/lenderRules/server/LenderRulesService';
import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import { shouldSendStepNotification } from '../../../utils/loanFunctions';
import Intl from '../../../utils/server/intl';
import {
  makeFeedback,
  FEEDBACK_OPTIONS,
} from '../../../components/OfferList/feedbackHelpers';
import Calculator, {
  Calculator as CalculatorClass,
} from '../../../utils/Calculator';
import { getZipcodeForCanton } from '../../../utils/zipcodes';
import {
  RESIDENCE_TYPE,
  ORGANISATION_FEATURES,
  LOAN_STATUS,
  LOAN_VERIFICATION_STATUS,
  CANTONS,
  EMAIL_IDS,
} from '../../constants';
import OfferService from '../../offers/server/OfferService';
import {
  adminLoan,
  lenderRules as lenderRulesFragment,
  userLoan,
} from '../../fragments';
import CollectionService from '../../helpers/CollectionService';
import BorrowerService from '../../borrowers/server/BorrowerService';
import PropertyService from '../../properties/server/PropertyService';
import PromotionService from '../../promotions/server/PromotionService';
import UserService from '../../users/server/UserService';
import OrganisationService from '../../organisations/server/OrganisationService';
import Loans from '../loans';
import { sendEmail } from '../../methods';
import { ORGANISATION_NAME_SEPARATOR } from '../loanConstants';
import fullLoan from '../queries/fullLoan';

// Pads a number with zeros: 4 --> 0004
const zeroPadding = (num, places) => {
  const zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
};

export class LoanService extends CollectionService {
  constructor() {
    super(Loans);
  }

  insert = ({ loan = {}, userId }) => {
    const name = this.getNewLoanName();
    return Loans.insert({ ...loan, name, userId });
  };

  insertAnonymousLoan = ({ proPropertyId, referralId }) => {
    let loanId;
    if (proPropertyId) {
      loanId = this.insertPropertyLoan({ propertyIds: [proPropertyId] });
    } else {
      const borrowerId = BorrowerService.insert({});
      loanId = this.insert({ loan: { borrowerIds: [borrowerId] } });
    }

    this.update({
      loanId,
      object: { anonymous: true, displayWelcomeScreen: false, referralId },
    });

    return loanId;
  };

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

  fullLoanInsert = ({ userId, loan = {} }) => {
    const borrowerId = BorrowerService.insert({ userId });
    const loanId = this.insert({
      loan: { borrowerIds: [borrowerId], ...loan },
      userId,
    });
    this.addNewStructure({ loanId });
    return loanId;
  };

  setStep({ loanId, nextStep }) {
    const { step, userId, user } = this.fetchOne({
      $filters: { _id: loanId },
      step: 1,
      userId: 1,
      user: { assignedEmployee: { name: 1 } },
    });

    this.update({ loanId, object: { step: nextStep } });

    if (shouldSendStepNotification(step, nextStep)) {
      if (!user || !user.assignedEmployee) {
        throw new Meteor.Error('Il faut un conseiller sur ce dossier pour envoyer un email');
      }

      sendEmail.run({
        emailId: EMAIL_IDS.FIND_LENDER_NOTIFICATION,
        userId,
        params: { loanId, assigneeName: user.assignedEmployee.name },
      });
    }
  }

  askVerification = ({ loanId }) => {
    const loan = this.get(loanId);

    if (
      loan.verificationStatus === LOAN_VERIFICATION_STATUS.REQUESTED
      || loan.verificationStatus === LOAN_VERIFICATION_STATUS.OK
    ) {
      // Don't do anything if this loan is already in requested mode
      throw new Meteor.Error('La vérification est déjà en cours, ou effectuée.');
    }

    return this.update({
      loanId,
      object: {
        verificationStatus: LOAN_VERIFICATION_STATUS.REQUESTED,
        userFormsEnabled: false,
      },
    });
  };

  insertPromotionLoan = ({
    userId,
    promotionId,
    invitedBy,
    showAllLots,
    promotionLotIds = [],
    shareSolvency,
  }) => {
    const borrowerId = BorrowerService.insert({ userId });
    const customName = PromotionService.fetchOne({
      $filters: { _id: promotionId },
      name: 1,
    }).name;
    const loanId = this.insert({
      loan: {
        borrowerIds: [borrowerId],
        promotionLinks: [{ _id: promotionId, invitedBy, showAllLots }],
        customName,
        shareSolvency,
      },
      userId,
    });

    promotionLotIds.forEach((promotionLotId) => {
      PromotionOptionService.insert({ promotionLotId, loanId });
    });

    this.addNewStructure({ loanId });

    return loanId;
  };

  insertPropertyLoan = ({ userId, propertyIds, shareSolvency }) => {
    const borrowerId = BorrowerService.insert({ userId });
    const customName = PropertyService.fetchOne({
      $filters: { _id: propertyIds[0] },
      address1: 1,
    }).address1;
    const loanId = this.insert({
      loan: {
        borrowerIds: [borrowerId],
        propertyIds,
        customName,
        shareSolvency,
      },
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
      structure = omit(structures.find(({ id }) => selectedStructure === id), [
        'name',
      ]);
    }

    const propertyId = (structure && structure.propertyId)
      || (propertyIds.length > 0 ? propertyIds[0] : undefined);
    const newStructureId = this.addStructure({
      loanId,
      structure: {
        ...structure,
        propertyId,
        name:
          (structure && structure.name)
          || `Plan financier ${structures.length + 1}`,
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
    const loan = this.get(loanId);
    this.addLink({ id: loanId, linkName: 'properties', linkId: propertyId });

    // Add this property to all structures that don't have a property
    // for a better user experience
    loan.structures.forEach(({ id, propertyId: structurePropertyId, promotionOptionId }) => {
      if (!structurePropertyId && !promotionOptionId) {
        this.updateStructure({
          loanId,
          structureId: id,
          structure: { propertyId },
        });
      }
    });
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
      properties = [],
      borrowers = [],
      referralId,
      anonymous,
    } = this.fetchOne({
      $filters: { _id: loanId },
      referralId: 1,
      properties: { loans: { _id: 1 }, address1: 1, category: 1 },
      borrowers: { loans: { _id: 1 }, name: 1 },
      anonymous: 1,
    });

    borrowers.forEach(({ loans = [], name }) => {
      if (loans.length > 1) {
        throw new Meteor.Error(`Peut pas réassigner l'hypothèque, l'emprunteur "${name}" est assigné à plus d'une hypothèque`);
      }
    });
    properties.forEach(({ loans = [], address1, category }) => {
      if (category === PROPERTY_CATEGORY.USER && loans.length > 1) {
        throw new Meteor.Error(`Peut pas réassigner l'hypothèque, le bien immobilier "${address1}" est assigné à plus d'une hypothèque`);
      }
    });

    this.update({
      loanId,
      object: {
        userId,
        anonymous: false,
        // If the loan was anonymous before, don't show welcome screen again
        displayWelcomeScreen: anonymous ? false : undefined,
      },
    });
    this.update({ loanId, object: { referralId: true }, operator: '$unset' });

    borrowers.forEach(({ _id: borrowerId }) => {
      BorrowerService.update({ borrowerId, object: { userId } });
    });
    properties.forEach(({ _id: propertyId, category }) => {
      if (category === PROPERTY_CATEGORY.USER) {
        PropertyService.update({ propertyId, object: { userId } });
      }
    });

    // Refer this user only if he hasn't already been referred
    if (referralId && UserService.exists(referralId)) {
      const {
        referredByUserLink,
        referredByOrganisationLink,
      } = UserService.fetchOne({
        $filters: { _id: userId },
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
      });
      if (!referredByUserLink && !referredByOrganisationLink) {
        UserService.setReferredBy({ userId, proId: referralId });
      }
    }
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
        formatMessage: Intl.formatMessage.bind(Intl),
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

  getMaxPropertyValueRange({ organisations, loan, residenceType, canton }) {
    const { borrowers = [] } = loan;
    const loanObject = Calculator.createLoanObject({
      residenceType,
      borrowers,
      canton,
    });
    const maxPropertyValues = organisations
      .map(({ lenderRules, name }) => {
        const calculator = new CalculatorClass({
          loan: loanObject,
          lenderRules,
        });

        const {
          borrowRatio,
          propertyValue,
        } = calculator.getMaxPropertyValueWithoutBorrowRatio({
          borrowers,
          residenceType,
          canton,
        });
        if (propertyValue > 0 && borrowRatio > 0) {
          return { borrowRatio, propertyValue, organisationName: name };
        }

        return null;
      })
      .filter(x => x);

    const sortedValues = maxPropertyValues.sort(({ propertyValue: propertyValueA }, { propertyValue: propertyValueB }) =>
      propertyValueA - propertyValueB);

    if (sortedValues.length === 0) {
      throw new Meteor.Error("Nous ne sommes pas parvenus à calculer votre capacité d'achat, contactez votre conseiller pour plus d'informations");
    }

    // Only show min if there is more than 1 result
    const showMin = sortedValues.length >= 2;
    // Only show second max if there are more than 3 results
    const showSecondMax = sortedValues.length >= 3;

    const min = showMin ? sortedValues[0] : undefined;

    // Don't take the max value, because that means there is only one single
    // lender who can make an offer on this loan
    const max = sortedValues[sortedValues.length - 1];
    const secondMax = showSecondMax
      ? sortedValues[sortedValues.length - 2]
      : max;

    // If there are at least 3 organisations, show a special label
    // that combines the best and secondBest org
    const maxOrganisationLabel = showSecondMax
      ? `${secondMax
          && secondMax.organisationName}${ORGANISATION_NAME_SEPARATOR}${
        max.organisationName
      } (${(max.borrowRatio * 100).toFixed(2)}%)`
      : max.organisationName;

    return {
      min,
      max: {
        ...secondMax,
        organisationName: maxOrganisationLabel,
      },
    };
  }

  getMaxPropertyValueWithoutBorrowRatio({ loan, canton, residenceType }) {
    let query = { features: { $in: [ORGANISATION_FEATURES.LENDER] } };
    if (loan.hasPromotion && loan.promotions[0].lenderOrganisationLink) {
      query = { _id: loan.promotions[0].lenderOrganisationLink._id };
    }

    const lenderOrganisations = OrganisationService.fetch({
      $filters: query,
      lenderRules: lenderRulesFragment(),
      name: 1,
    });

    return this.getMaxPropertyValueRange({
      organisations: lenderOrganisations.filter(({ lenderRules }) => lenderRules && lenderRules.length > 0),
      loan,
      residenceType: residenceType || loan.residenceType,
      canton,
    });
  }

  setMaxPropertyValueWithoutBorrowRatio({ loanId, canton }) {
    const loan = this.fetchOne({ $filters: { _id: loanId }, ...userLoan() });

    const mainMaxPropertyValueRange = this.getMaxPropertyValueWithoutBorrowRatio({
      loan,
      residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
      canton,
    });
    const secondMaxPropertyValueRange = this.getMaxPropertyValueWithoutBorrowRatio({
      loan,
      residenceType: RESIDENCE_TYPE.SECOND_RESIDENCE,
      canton,
    });

    const borrowerHash = Calculator.getBorrowerFormHash({
      borrowers: loan.borrowers,
    });

    this.update({
      loanId,
      object: {
        maxPropertyValue: {
          main: mainMaxPropertyValueRange,
          second: secondMaxPropertyValueRange,
          canton,
          date: new Date(),
          borrowerHash,
        },
      },
    });

    return Promise.resolve();
  }

  addNewMaxStructure({ loanId, residenceType: newResidenceType, canton }) {
    if (newResidenceType) {
      // Set residence type if it is given
      this.update({ loanId, object: { residenceType: newResidenceType } });
    }

    const loan = this.fetchOne({
      $filters: { _id: loanId },
      ...userLoan(),
    });
    const { properties = [], userId, borrowers, residenceType } = loan;

    // Get the highest property value
    const {
      max: { borrowRatio, propertyValue, organisationName },
    } = this.getMaxPropertyValueWithoutBorrowRatio({
      loan,
      canton,
    });
    const firstOrganisationName = organisationName.split(ORGANISATION_NAME_SEPARATOR)[0];

    const organisation = OrganisationService.fetchOne({
      $filters: { name: firstOrganisationName },
      lenderRules: lenderRulesFragment(),
    });

    const calculator = new CalculatorClass({
      loan,
      lenderRules: organisation.lenderRules,
    });

    // Recalculate the best structure for this propertyvalue
    const ownFunds = calculator.suggestStructure({
      borrowers,
      propertyValue,
      loanValue: Math.round(propertyValue * borrowRatio),
      canton,
      residenceType,
    });

    let propertyWithCanton = properties.find(({ canton: propertyCanton }) => propertyCanton === canton);
    const createNewProperty = !propertyWithCanton;

    // If there is no property from this canton, insert a new one
    // with the right canton
    if (createNewProperty) {
      const propertyId = PropertyService.insert({
        property: {
          address1: `Bien immo ${CANTONS[canton]}`,
          zipCode: getZipcodeForCanton(canton),
          value: propertyValue,
        },
        loanId,
        userId,
      });

      propertyWithCanton = { _id: propertyId };
    }

    this.addNewStructure({
      loanId,
      structure: {
        name: "Capacité d'achat max.",
        description: CANTONS[canton],
        propertyId: propertyWithCanton._id,
        ownFunds,
        propertyValue: createNewProperty ? undefined : propertyValue,
        wantedLoan: Math.round(propertyValue * borrowRatio),
      },
    });
  }

  getLoanCalculator({ loanId, structureId }) {
    const loan = fullLoan.clone({ _id: loanId }).fetchOne();

    let lenderRules;

    if (loan && loan.structure && loan.structure.offerId) {
      lenderRules = loan.structure.offer.lender.organisation.lenderRules;
    } else if (loan.hasPromotion) {
      const { lenderOrganisationLink } = loan.promotions[0];
      if (lenderOrganisationLink) {
        lenderRules = LenderRulesService.find({
          'organisationLink._id': lenderOrganisationLink._id,
        }).fetch();
      }
    }

    if (!lenderRules || lenderRules.length === 0) {
      return Calculator;
    }

    return new CalculatorClass({
      loan,
      structureId,
      lenderRules,
    });
  }

  expireAnonymousLoans() {
    const lastWeek = moment()
      .subtract('days', 7)
      .toDate();

    return this.baseUpdate(
      {
        anonymous: true,
        status: { $ne: LOAN_STATUS.UNSUCCESSFUL },
        updatedAt: { $lte: lastWeek },
      },
      { $set: { status: LOAN_STATUS.UNSUCCESSFUL } },
      { multi: true },
    );
  }
}

export default new LoanService({});
