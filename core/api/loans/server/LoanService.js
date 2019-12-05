import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import omit from 'lodash/omit';
import moment from 'moment';

import LenderRulesService from 'core/api/lenderRules/server/LenderRulesService';
import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import { ACTIVITY_EVENT_METADATA } from 'core/api/activities/activityConstants';
import ActivityService from 'core/api/activities/server/ActivityService';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
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
  CANTONS,
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
import {
  ORGANISATION_NAME_SEPARATOR,
  STEPS,
  APPLICATION_TYPES,
  LOAN_STATUS_ORDER,
} from '../loanConstants';
import { fullLoan } from '../queries';

// Pads a number with zeros: 4 --> 0004
const zeroPadding = (num, places) => {
  const zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
};

class LoanService extends CollectionService {
  constructor() {
    super(Loans);
    this.get = this.makeGet(adminLoan());
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
      loanId = this.insert({ loan: {} });
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
    const loanId = this.insert({
      loan,
      userId,
    });
    this.addNewStructure({ loanId });
    return loanId;
  };

  setStep({ loanId, nextStep }) {
    const { step, user } = this.fetchOne({
      $filters: { _id: loanId },
      step: 1,
      userId: 1,
      user: { assignedEmployee: { name: 1 } },
    });

    this.update({ loanId, object: { step: nextStep } });

    return { step, nextStep, user };
  }

  verifyStatusChange({ loanId, status }) {
    const { status: prevStatus } = this.fetchOne({
      $filters: { _id: loanId },
      status: 1,
    });

    if (prevStatus === status) {
      throw new Meteor.Error("Ce statut est le même qu'avant");
    }

    const orderedStatuses = LOAN_STATUS_ORDER.filter(
      s =>
        ![
          LOAN_STATUS.PENDING,
          LOAN_STATUS.UNSUCCESSFUL,
          LOAN_STATUS.TEST,
        ].includes(s),
    );

    // Resurrection or kill
    if (
      !orderedStatuses.includes(status) ||
      !orderedStatuses.includes(prevStatus)
    ) {
      return prevStatus;
    }

    const statusIndex = orderedStatuses.indexOf(status);
    const prevStatusIndex = orderedStatuses.indexOf(prevStatus);

    // Status change does not respect the order
    if (
      statusIndex !== prevStatusIndex + 1 &&
      statusIndex !== prevStatusIndex - 1
    ) {
      throw new Meteor.Error('Vous ne pouvez pas sauter des statuts');
    }

    return prevStatus;
  }

  setStatus({ loanId, status }) {
    const prevStatus = this.verifyStatusChange({ loanId, status });

    this.update({ loanId, object: { status } });
    return { prevStatus, nextStatus: status };
  }

  insertPromotionLoan = ({
    userId,
    promotionId,
    invitedBy,
    showAllLots,
    promotionLotIds = [],
    shareSolvency,
  }) => {
    const customName = PromotionService.fetchOne({
      $filters: { _id: promotionId },
      name: 1,
    }).name;
    const loanId = this.insert({
      loan: {
        promotionLinks: [{ _id: promotionId, invitedBy, showAllLots }],
        customName,
        shareSolvency,
      },
      userId,
    });

    promotionLotIds.forEach(promotionLotId => {
      PromotionOptionService.insert({ promotionLotId, loanId, promotionId });
    });

    this.addNewStructure({ loanId });

    return loanId;
  };

  insertPropertyLoan = ({ userId, propertyIds, shareSolvency, loan }) => {
    const customName = PropertyService.fetchOne({
      $filters: { _id: propertyIds[0] },
      address1: 1,
    }).address1;
    const loanId = this.insert({
      loan: {
        propertyIds,
        customName,
        shareSolvency,
        ...loan,
      },
      userId,
    });

    this.addNewStructure({ loanId });
    return loanId;
  };

  confirmClosing = ({ loanId, object }) =>
    this.update({ loanId, object: { status: LOAN_STATUS.BILLING, ...object } });

  pushValue = ({ loanId, object }) => Loans.update(loanId, { $push: object });

  popValue = ({ loanId, object }) => Loans.update(loanId, { $pop: object });

  pullValue = ({ loanId, object }) => Loans.update(loanId, { $pull: object });

  addStructure = ({ loanId, structure, atIndex }) => {
    const newStructureId = Random.id();
    Loans.update(loanId, {
      $push: {
        structures: {
          $each: [{ ...structure, id: newStructureId, disabled: false }],
          $position: atIndex,
        },
      },
    });
    return newStructureId;
  };

  addNewStructure = ({ loanId, structure }) => {
    const { structures, selectedStructure, propertyIds } = this.findOne(loanId);
    const isFirstStructure = structures.length === 0;
    const shouldCopyExistingStructure =
      !isFirstStructure && !structure && selectedStructure;

    if (shouldCopyExistingStructure) {
      structure = omit(
        structures.find(({ id }) => selectedStructure === id),
        ['name'],
      );
    }

    const propertyId =
      (structure && structure.propertyId) ||
      (propertyIds.length > 0 ? propertyIds[0] : undefined);
    const newStructureId = this.addStructure({
      loanId,
      structure: {
        ...structure,
        propertyId,
        name:
          (structure && structure.name) ||
          `Plan financier ${structures.length + 1}`,
      },
    });
    this.update({
      loanId,
      object: isFirstStructure ? { selectedStructure: newStructureId } : {},
    });

    return newStructureId;
  };

  removeStructure = ({ loanId, structureId }) => {
    const { selectedStructure: currentlySelected } = this.findOne(loanId);

    if (currentlySelected === structureId) {
      throw new Meteor.Error(
        'Vous ne pouvez pas supprimer votre plan financier choisi',
      );
    }

    const updateObj = {
      $pull: { structures: { id: structureId } },
    };

    return Loans.update(loanId, updateObj, {
      // Edge case fix: https://github.com/meteor/meteor/issues/4342
      getAutoValues: false,
    });
  };

  updateStructure = ({ loanId, structureId, structure }) => {
    const currentStructure = this.findOne(loanId).structures.find(
      ({ id }) => id === structureId,
    );

    return Loans.update(
      { _id: loanId, 'structures.id': structureId },
      { $set: { 'structures.$': { ...currentStructure, ...structure } } },
    );
  };

  selectStructure = ({ loanId, structureId }) => {
    const loan = this.findOne(loanId, {
      fields: { structures: 1, selectedStructure: 1 },
    });

    const currentStructure = loan.structures.find(
      ({ id }) => id === loan.selectedStructure,
    );

    if (currentStructure && currentStructure.disabled) {
      throw new Meteor.Error(
        'Vous ne pouvez pas changer votre plan financier, il est vérouillé',
      );
    }

    // Make sure the structure exists
    const structureExists = loan.structures.some(
      ({ id }) => id === structureId,
    );

    if (structureExists) {
      return this.update({
        loanId,
        object: { selectedStructure: structureId },
      });
    }

    throw new Meteor.Error(`Structure with id "${structureId}" does not exist`);
  };

  duplicateStructure = ({ loanId, structureId }) => {
    const { structures } = this.findOne(loanId);
    const currentStructure = structures.find(({ id }) => id === structureId);
    const currentStructureIndex = structures.findIndex(
      ({ id }) => id === structureId,
    );

    return (
      !!currentStructure &&
      this.addStructure({
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
    const loan = this.findOne(loanId);
    this.addLink({ id: loanId, linkName: 'properties', linkId: propertyId });

    // Add this property to all structures that don't have a property
    // for a better user experience
    loan.structures.forEach(
      ({ id, propertyId: structurePropertyId, promotionOptionId }) => {
        if (!structurePropertyId && !promotionOptionId) {
          this.updateStructure({
            loanId,
            structureId: id,
            structure: { propertyId },
          });
        }
      },
    );
  };

  cleanupRemovedBorrower = ({ borrowerId }) => {
    // Remove all references to this borrower on the loan
    const loans = Loans.find({ borrowerIds: borrowerId }).fetch();
    loans.forEach(loan => {
      this.update({
        loanId: loan._id,
        object: {
          structures: loan.structures.map(structure => ({
            ...structure,
            ownFunds: structure.ownFunds.filter(
              ({ borrowerId: bId }) => bId !== borrowerId,
            ),
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
    const promotionLink = this.findOne(loanId).promotionLinks.find(
      ({ _id }) => _id === promotionId,
    );
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
        throw new Meteor.Error(
          `Peut pas réassigner l'hypothèque, l'emprunteur "${name}" est assigné à plus d'une hypothèque`,
        );
      }
    });
    properties.forEach(({ loans = [], address1, category }) => {
      if (category === PROPERTY_CATEGORY.USER && loans.length > 1) {
        throw new Meteor.Error(
          `Peut pas réassigner l'hypothèque, le bien immobilier "${address1}" est assigné à plus d'une hypothèque`,
        );
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
    if (referralId) {
      if (UserService.exists(referralId)) {
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

      if (OrganisationService.exists(referralId)) {
        const {
          referredByUserLink,
          referredByOrganisationLink,
        } = UserService.fetchOne({
          $filters: { _id: userId },
          referredByUserLink: 1,
          referredByOrganisationLink: 1,
        });
        if (!referredByUserLink && !referredByOrganisationLink) {
          UserService.setReferredByOrganisation({
            userId,
            organisationId: referralId,
          });
        }
      }
    }
  }

  switchBorrower({ loanId, borrowerId, oldBorrowerId }) {
    const { borrowerIds } = this.findOne(loanId);
    const { loans: oldBorrowerLoans = [] } = BorrowerService.createQuery({
      $filters: { _id: oldBorrowerId },
      loans: { name: 1 },
    }).fetchOne();

    if (borrowerIds.includes(borrowerId)) {
      throw new Meteor.Error(
        'Cet emprunteur est déjà sur ce prêt hypothécaire',
      );
    }

    this.update({
      loanId,
      object: {
        borrowerIds: borrowerIds.map(id =>
          id === oldBorrowerId ? borrowerId : id,
        ),
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
    } =
      this.createQuery({
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

      const lenderIsAlreadyInMailingList = filtered.find(
        ({
          lender: {
            contact: { email },
          },
        }) => lenderEmail === email,
      );

      if (lenderIsAlreadyInMailingList) {
        return filtered;
      }

      return [...filtered, offer];
    }, []);

    return filteredOffers.map(offer => ({
      feedback: makeFeedback({
        offer: { ...offer, property },
        model: { option: FEEDBACK_OPTIONS.NEGATIVE_WITHOUT_FOLLOW_UP },
        formatMessage: Intl.formatMessage.bind(Intl),
      }),
      offerId: offer._id,
    }));
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
    const loan = this.findOne(loanId);

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

    const sortedValues = maxPropertyValues.sort(
      ({ propertyValue: propertyValueA }, { propertyValue: propertyValueB }) =>
        propertyValueA - propertyValueB,
    );

    if (sortedValues.length === 0) {
      throw new Meteor.Error(
        "Nous ne sommes pas parvenus à calculer votre capacité d'achat, ajustez vos informations financières, ou contactez votre conseiller pour plus d'informations",
      );
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
      ? `${secondMax &&
          secondMax.organisationName}${ORGANISATION_NAME_SEPARATOR}${
          max.organisationName
        } (${(max.borrowRatio * 100).toFixed(2)}%)`
      : max.organisationName;

    return {
      min,
      max: { ...secondMax, organisationName: maxOrganisationLabel },
    };
  }

  getMaxPropertyValueWithoutBorrowRatio({ loan, canton, residenceType }) {
    let query = {
      features: ORGANISATION_FEATURES.LENDER,
      lenderRulesCount: { $gte: 1 },
    };

    if (loan.hasPromotion && loan.promotions[0].lenderOrganisationLink) {
      query = { _id: loan.promotions[0].lenderOrganisationLink._id };
    }

    const lenderOrganisations = OrganisationService.fetch({
      $filters: query,
      lenderRules: lenderRulesFragment(),
      name: 1,
    });

    return this.getMaxPropertyValueRange({
      organisations: lenderOrganisations,
      loan,
      residenceType: residenceType || loan.residenceType,
      canton,
    });
  }

  setMaxPropertyValueWithoutBorrowRatio({ loanId, canton }) {
    const loan = this.fetchOne({ $filters: { _id: loanId }, ...userLoan() });
    const isRecalculate = !!(
      loan.maxPropertyValue && loan.maxPropertyValue.date
    );

    const mainMaxPropertyValueRange = this.getMaxPropertyValueWithoutBorrowRatio(
      {
        loan,
        residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
        canton,
      },
    );
    const secondMaxPropertyValueRange = this.getMaxPropertyValueWithoutBorrowRatio(
      {
        loan,
        residenceType: RESIDENCE_TYPE.SECOND_RESIDENCE,
        canton,
      },
    );

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

    return Promise.resolve({ isRecalculate });
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
    const firstOrganisationName = organisationName.split(
      ORGANISATION_NAME_SEPARATOR,
    )[0];

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

    let propertyWithCanton = properties.find(
      ({ canton: propertyCanton }) => propertyCanton === canton,
    );
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
        lenderRules = LenderRulesService.fetch({
          $filters: { 'organisationLink._id': lenderOrganisationLink._id },
          ...lenderRulesFragment(),
        });
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
      .subtract(5, 'days')
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

  insertBorrowers({ loanId, amount }) {
    const { borrowerIds: existingBorrowers = [], userId } = this.findOne(
      loanId,
    );

    if (existingBorrowers.length === 2) {
      throw new Meteor.Error('Cannot insert more borrowers');
    }

    if (existingBorrowers.length === 1 && amount === 2) {
      throw new Meteor.Error('Can insert only one more borrower');
    }

    if (amount === 1) {
      const borrowerId = BorrowerService.insert({ userId });
      this.addLink({
        id: loanId,
        linkName: 'borrowers',
        linkId: borrowerId,
      });
    } else if (amount === 2) {
      const borrowerId1 = BorrowerService.insert({ userId });
      const borrowerId2 = BorrowerService.insert({ userId });
      this.addLink({
        id: loanId,
        linkName: 'borrowers',
        linkId: borrowerId1,
      });
      this.addLink({
        id: loanId,
        linkName: 'borrowers',
        linkId: borrowerId2,
      });
    } else {
      throw new Meteor.Error('Invalid borrowers number');
    }
  }

  // Useful for demos
  resetLoan({ loanId }) {
    const loan = this.findOne({ _id: loanId });
    const { structures = [], borrowerIds = [], status } = loan;

    if (status !== LOAN_STATUS.TEST) {
      throw new Meteor.Error(
        'Seuls les dossiers avec le statut TEST peuvent être réinitialisés !',
      );
    }

    // Set step to solvency
    this.setStep({ loanId, nextStep: STEPS.SOLVENCY });

    // Set application type to simple
    this.update({
      loanId,
      object: { applicationType: APPLICATION_TYPES.SIMPLE },
    });

    // Remove structures and an empty one
    // structures.forEach(({ _id: structureId }) => {
    //   this.removeStructure({ loanId, structureId });
    // });
    // this.addNewStructure({ loanId });

    // Remove MaxPropertyValue
    this.update({
      loanId,
      object: { maxPropertyValue: true },
      operator: '$unset',
    });

    // Reset borrowers financing info
    // borrowerIds.forEach((borrowerId) => {
    //   BorrowerService.update({
    //     borrowerId,
    //     object: {
    //       netSalary: null,
    //       salary: null,
    //       bankFortune: null,
    //       insurance2: [],
    //       insurance3A: [],
    //       bank3A: [],
    //       insurance3B: [],
    //       otherIncome: [],
    //       otherFortune: [],
    //       expenses: [],
    //       realEstate: [],
    //       bonusExists: false,
    //       bonus2015: null,
    //       bonus2016: null,
    //       bonus2017: null,
    //       bonus2018: null,
    //       bonus2019: null,
    //     },
    //   });
    // });
  }

  linkPromotion({ promotionId, loanId }) {
    const { name: promotionName, promotionLoan } = PromotionService.fetchOne({
      $filters: { _id: promotionId },
      name: 1,
      promotionLoan: { _id: 1 },
    });

    if (promotionLoan && promotionLoan._id) {
      this.unlinkPromotion({ promotionId, loanId: promotionLoan._id });
    }

    this.addLink({
      id: loanId,
      linkName: 'financedPromotion',
      linkId: promotionId,
    });

    this.update({
      loanId,
      object: { customName: `Financement de ${promotionName}` },
    });

    return loanId;
  }

  unlinkPromotion({ promotionId, loanId }) {
    this.removeLink({
      id: loanId,
      linkName: 'financedPromotion',
      linkId: promotionId,
    });

    return this.update({
      loanId,
      object: { customName: true },
      operator: '$unset',
    });
  }

  setCreatedAtActivityDescription({ loanId, description }) {
    const { activities = [] } = this.fetchOne({
      $filters: { _id: loanId },
      activities: { metadata: 1 },
    });
    const { _id: createdAtActivityId } =
      activities.find(
        ({ metadata }) =>
          metadata && metadata.event === ACTIVITY_EVENT_METADATA.CREATED,
      ) || {};

    if (createdAtActivityId) {
      ActivityService.updateDescription({
        id: createdAtActivityId,
        description,
      });
    }

    return loanId;
  }
}

export default new LoanService({});
