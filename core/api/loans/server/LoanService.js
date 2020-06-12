import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import merge from 'lodash/merge';
import omit from 'lodash/omit';
import sortBy from 'lodash/sortBy';
import moment from 'moment';

import {
  FEEDBACK_OPTIONS,
  makeFeedback,
} from '../../../components/OfferList/feedbackHelpers';
import Calculator, {
  Calculator as CalculatorClass,
} from '../../../utils/Calculator';
import intl from '../../../utils/intl';
import { getZipcodeForCanton } from '../../../utils/zipcodes';
import { ACTIVITY_EVENT_METADATA } from '../../activities/activityConstants';
import ActivityService from '../../activities/server/ActivityService';
import BorrowerService from '../../borrowers/server/BorrowerService';
import {
  calculatorLoan,
  lenderRules as lenderRulesFragment,
  userLoan,
} from '../../fragments';
import {
  getNewName,
  removeAdminNote,
  setAdminNote,
  setAssignees,
  updateProNote,
} from '../../helpers/server/collectionServerHelpers';
import CollectionService from '../../helpers/server/CollectionService';
import LenderRulesService from '../../lenderRules/server/LenderRulesService';
import { ORGANISATION_FEATURES } from '../../organisations/organisationConstants';
import OrganisationService from '../../organisations/server/OrganisationService';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import PromotionService from '../../promotions/server/PromotionService';
import {
  PROPERTY_CATEGORY,
  RESIDENCE_TYPE,
} from '../../properties/propertyConstants';
import PropertyService from '../../properties/server/PropertyService';
import { REVENUE_STATUS, REVENUE_TYPES } from '../../revenues/revenueConstants';
import UserService from '../../users/server/UserService';
import {
  APPLICATION_TYPES,
  CANTONS,
  LOANS_COLLECTION,
  LOAN_STATUS,
  LOAN_STATUS_ORDER,
  ORGANISATION_NAME_SEPARATOR,
  PURCHASE_TYPE,
  STEPS,
} from '../loanConstants';
import Loans from '../loans';

const { formatMessage } = intl;

class LoanService extends CollectionService {
  constructor() {
    super(Loans);
  }

  insert = ({ loan = {}, userId, insuranceRequestId }) => {
    const name = getNewName({
      collection: LOANS_COLLECTION,
      insuranceRequestId,
    });
    const loanId = super.insert({ ...loan, name, userId });

    if (userId) {
      const user = UserService.get(userId, { assignedEmployee: { _id: 1 } });

      if (user?.assignedEmployee?._id) {
        this.setAssignees({
          loanId,
          assignees: [
            { _id: user.assignedEmployee._id, percent: 100, isMain: true },
          ],
        });
      }
    }

    return loanId;
  };

  setAssignees = ({ loanId, ...params }) =>
    setAssignees({ docId: loanId, collection: LOANS_COLLECTION, ...params });

  insertAnonymousLoan = ({ proPropertyId, referralId, purchaseType }) => {
    let loanId;
    if (proPropertyId) {
      loanId = this.insertPropertyLoan({ propertyIds: [proPropertyId] });
    } else {
      loanId = this.insert({ loan: {} });
    }

    this.update({
      loanId,
      object: {
        anonymous: true,
        displayWelcomeScreen: false,
        referralId,
        purchaseType,
      },
    });

    return loanId;
  };

  update = ({ loanId, object, operator = '$set' }) =>
    Loans.update(loanId, { [operator]: object });

  remove = ({ loanId }) => {
    const { revenues = [] } =
      this.get(loanId, { revenues: { status: 1 } }) || {};
    if (
      revenues.filter(({ status }) => status === REVENUE_STATUS.EXPECTED).length
    ) {
      throw new Meteor.Error(
        'Des revenus sont attendus pour ce dossier. Merci de les supprimer manuellement avant de supprimer le dossier',
      );
    }
    return super.remove(loanId);
  };

  fullLoanInsert = ({ userId, loan = {} }) => {
    const loanId = this.insert({
      loan,
      userId,
    });
    this.addNewStructure({ loanId });
    return loanId;
  };

  setStep({ loanId, nextStep }) {
    const { step, mainAssignee, userId } = this.get(loanId, {
      step: 1,
      userId: 1,
      mainAssignee: 1,
    });

    this.update({ loanId, object: { step: nextStep } });

    return { step, nextStep, mainAssignee, userId };
  }

  verifyStatusChange({ loanId, status }) {
    const { status: prevStatus } = this.get(loanId, { status: 1 });

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
    if (status !== LOAN_STATUS.UNSUCCESSFUL) {
      this.update({
        loanId,
        object: { unsuccessfulReason: true },
        operator: '$unset',
      });
    }
    return { prevStatus, nextStatus: status };
  }

  setDisbursementDate({ loanId, disbursementDate }) {
    this.update({ loanId, object: { disbursementDate } });
  }

  insertPromotionLoan = ({
    userId,
    promotionId,
    invitedBy,
    showAllLots,
    promotionLotIds = [],
    shareSolvency,
  }) => {
    const { name: customName } = PromotionService.get(promotionId, { name: 1 });
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
    const customName = PropertyService.get(propertyIds[0], { address1: 1 })
      .address1;
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

  pushValue = ({ loanId, object }) =>
    this.baseUpdate(loanId, { $push: object });

  popValue = ({ loanId, object }) => this.baseUpdate(loanId, { $pop: object });

  pullValue = ({ loanId, object }) =>
    this.baseUpdate(loanId, { $pull: object });

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
    const { structures, selectedStructure, propertyIds } = this.get(loanId, {
      structures: 1,
      selectedStructure: 1,
      propertyIds: 1,
    });
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
    const { selectedStructure: currentlySelected } = this.get(loanId, {
      selectedStructure: 1,
    });

    if (currentlySelected === structureId) {
      throw new Meteor.Error(
        'Vous ne pouvez pas supprimer votre plan financier choisi',
      );
    }

    const updateObj = {
      $pull: { structures: { id: structureId } },
    };

    return this.baseUpdate(loanId, updateObj, {
      // Edge case fix: https://github.com/meteor/meteor/issues/4342
      getAutoValues: false,
    });
  };

  updateStructure = ({ loanId, structureId, structure }) => {
    const currentStructure = this.get(loanId, {
      structures: 1,
    })?.structures.find(({ id }) => id === structureId);

    const {
      loanTranches: previousLoanTranches = [],
      wantedLoan: previousWantedLoan,
    } = currentStructure;
    const { wantedLoan: newWantedLoan } = structure;

    let newLoanTranches;

    if (
      newWantedLoan &&
      newWantedLoan !== previousWantedLoan &&
      previousLoanTranches.length === 1
    ) {
      newLoanTranches = previousLoanTranches.map(tranche => ({
        ...tranche,
        value: newWantedLoan,
      }));
    }

    return Loans.update(
      { _id: loanId, 'structures.id': structureId },
      {
        $set: {
          'structures.$': {
            ...currentStructure,
            ...structure,
            ...(newLoanTranches ? { loanTranches: newLoanTranches } : {}),
          },
        },
      },
    );
  };

  selectStructure = ({ loanId, structureId }) => {
    const loan = this.get(loanId, { structures: 1, selectedStructure: 1 });

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
    const { structures } = this.get(loanId, { structures: 1 });
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
    const loan = this.get(loanId, { structures: 1 });
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
    const promotionLink = this.get(loanId, {
      promotionLinks: 1,
    }).promotionLinks.find(({ _id }) => _id === promotionId);
    return promotionLink ? promotionLink.priorityOrder : [];
  }

  assignLoanToUser({ loanId, userId }) {
    const {
      properties = [],
      borrowers = [],
      referralId,
      anonymous,
      assigneeLinks,
    } = this.get(loanId, {
      referralId: 1,
      properties: { loans: { _id: 1 }, address1: 1, category: 1 },
      borrowers: { loans: { _id: 1 }, name: 1 },
      anonymous: 1,
      assigneeLinks: 1,
    });
    const user = UserService.get(userId, { assignedEmployee: { name: 1 } });

    let newAssignee;

    // Only assign someone new to this loan if there are no current assignees
    if (!assigneeLinks || assigneeLinks.length === 0) {
      newAssignee = user && user.assignedEmployee && user.assignedEmployee._id;
    }

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

    if (newAssignee) {
      this.setAssignees({
        loanId,
        assignees: [{ _id: newAssignee, percent: 100, isMain: true }],
      });
    }

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
        } = UserService.get(userId, {
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
        } = UserService.get(userId, {
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
    const { borrowerIds } = this.get(loanId, { borrowerIds: 1 });
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
    const loan = this.get(loanId, {
      structure: 1,
      properties: { address1: 1, zipCode: 1, city: 1 },
      borrowers: { name: 1 },
      userCache: 1,
      createdAt: 1,
      lenders: {
        contact: { email: 1, firstName: 1 },
        offers: {
          createdAt: 1,
          $options: { sort: { createdAt: -1 }, limit: 1 },
        }, // Sort offers to get the last one only
      },
    });

    if (!loan.lenders?.length) {
      return [];
    }

    const lastOffers = loan.lenders
      .filter(({ offers }) => offers?.length)
      .map(({ offers }) => offers[0]);

    return lastOffers.map(offer => ({
      feedback: makeFeedback({
        offer,
        loan,
        model: { option: FEEDBACK_OPTIONS.NEGATIVE_WITHOUT_FOLLOW_UP },
        formatMessage,
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
    const loan = this.get(loanId, { propertyIds: 1 });

    if (loan.propertyIds.includes(propertyId)) {
      return false;
    }

    this.addLink({ id: loanId, linkName: 'properties', linkId: propertyId });
  }

  getMaxPropertyValueRange({ organisations, loan, residenceType, canton }) {
    const { borrowers = [], purchaseType } = loan;

    const loanObject = Calculator.createLoanObject({
      residenceType,
      borrowers,
      canton,
      purchaseType,
    });
    const maxPropertyValues = organisations
      .map(({ lenderRules, name }) => {
        const calculator = new CalculatorClass({
          loan: loanObject,
          lenderRules,
        });
        let borrowRatio;
        let propertyValue;

        if (purchaseType === PURCHASE_TYPE.ACQUISITION) {
          const result = calculator.getMaxPropertyValueWithoutBorrowRatio({
            borrowers,
            residenceType,
            canton,
            purchaseType,
          });
          borrowRatio = result.borrowRatio;
          propertyValue = result.propertyValue;
        }

        if (purchaseType === PURCHASE_TYPE.REFINANCING) {
          const result = calculator.getMaxBorrowRatioForLoan({
            loan,
            canton,
          });
          borrowRatio = result.borrowRatio;
          propertyValue = result.propertyValue;
        }

        if (propertyValue > 0 && borrowRatio > 0) {
          return { borrowRatio, propertyValue, organisationName: name };
        }

        return null;
      })
      .filter(x => x);

    const sortedValues = sortBy(maxPropertyValues, [
      'propertyValue',
      'borrowRatio',
    ]);

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

  getMaxPropertyValue({ loan, canton, residenceType }) {
    let query = {
      features: ORGANISATION_FEATURES.LENDER,
      lenderRulesCount: { $gte: 1 },
    };

    if (
      loan.hasPromotion &&
      loan.promotions[0].lenderOrganisationLink &&
      loan.promotions[0].lenderOrganisationLink._id
    ) {
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

  setMaxPropertyValue({ loan, canton }) {
    const isRecalculate = !!(
      loan.maxPropertyValue && loan.maxPropertyValue.date
    );

    const mainMaxPropertyValueRange = this.getMaxPropertyValue({
      loan,
      residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
      canton,
    });
    const secondMaxPropertyValueRange = this.getMaxPropertyValue({
      loan,
      residenceType: RESIDENCE_TYPE.SECOND_RESIDENCE,
      canton,
    });

    const borrowerHash = Calculator.getMaxPropertyValueHash({ loan });

    this.update({
      loanId: loan._id,
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

  setMaxPropertyValueOrBorrowRatio({ loanId, canton }) {
    const loan = this.get(loanId, userLoan());

    return this.setMaxPropertyValue({ loan, canton });
  }

  addNewMaxStructure({ loanId, residenceType: newResidenceType, canton }) {
    if (newResidenceType) {
      // Set residence type if it is given
      this.update({ loanId, object: { residenceType: newResidenceType } });
    }

    const loan = this.get(loanId, userLoan());
    const {
      properties = [],
      userId,
      borrowers,
      residenceType,
      purchaseType,
    } = loan;

    // Get the highest property value
    const {
      max: { borrowRatio, propertyValue, organisationName },
    } = this.getMaxPropertyValue({
      loan,
      canton,
      residenceType,
    });
    const [firstOrganisationName] = organisationName.split(
      ORGANISATION_NAME_SEPARATOR,
    );

    const organisation = OrganisationService.get(
      { name: firstOrganisationName },
      { lenderRules: lenderRulesFragment() },
    );

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
      purchaseType,
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
    const loan = this.get(
      loanId,
      merge({}, calculatorLoan(), {
        promotions: { lenderOrganisationLink: 1 },
        selectedLenderOrganisation: {
          name: 1,
          lenderRules: lenderRulesFragment(),
        },
      }),
    );
    let lenderRules;

    if (loan.selectedLenderOrganisation) {
      lenderRules = loan.selectedLenderOrganisation.lenderRules;
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
    const { borrowerIds: existingBorrowers = [], userId } = this.get(loanId, {
      borrowerIds: 1,
      userId: 1,
    });

    if (existingBorrowers.length === 2) {
      throw new Meteor.Error('Cannot insert more borrowers');
    }

    if (existingBorrowers.length === 1 && amount === 2) {
      throw new Meteor.Error('Can insert only one more borrower');
    }

    if (amount === 1) {
      const borrowerId = BorrowerService.insert({
        userId,
        loanId,
      });
    } else if (amount === 2) {
      const borrowerId1 = BorrowerService.insert({ userId, loanId });
      const borrowerId2 = BorrowerService.insert({ userId, loanId });
    } else {
      throw new Meteor.Error('Invalid borrowers number');
    }
  }

  // Useful for demos
  resetLoan({ loanId }) {
    const loan = this.get(loanId, { structures: 1, borrowerIds: 1, status: 1 });
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
    const { name: promotionName, promotionLoan } = PromotionService.get(
      promotionId,
      {
        name: 1,
        promotionLoan: { _id: 1 },
      },
    );

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
    const { activities = [] } = this.get(loanId, {
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

  setAdminNote({ loanId, adminNoteId, note, userId }) {
    return setAdminNote.bind(this)({
      docId: loanId,
      adminNoteId,
      note,
      userId,
    });
  }

  removeAdminNote(...args) {
    return removeAdminNote.bind(this)(...args);
  }

  updateProNote(...args) {
    return updateProNote.bind(this)(...args);
  }

  getDisbursedSoonLoans() {
    const in10Days = moment().add(10, 'days');
    const in11Days = moment().add(11, 'days');

    const disbursedIn10Days = this.fetch({
      $filters: {
        disbursementDate: {
          $lte: in11Days.startOf('day').toDate(),
          $gte: in10Days.startOf('day').toDate(),
        },
      },
      _id: 1,
    });

    return disbursedIn10Days.map(({ _id }) => _id);
  }

  getMainAssignee({ loanId }) {
    const { assignees = [] } = this.get(loanId, {
      assignees: { email: 1, name: 1 },
    });

    return assignees.length === 1
      ? assignees[0]
      : assignees.find(({ $metadata: { isMain } }) => isMain);
  }

  linkBorrower({ loanId, borrowerId }) {
    this.addLink({ id: loanId, linkName: 'borrowers', linkId: borrowerId });
  }

  setStatusToFinalizedIfRequired({ loanId }) {
    const { revenues = [], status: prevStatus, mainAssignee = {} } = this.get(
      loanId,
      {
        revenues: { status: 1, type: 2 },
        status: 1,
        mainAssignee: 1,
      },
    );

    const shouldBeFinalized =
      prevStatus !== LOAN_STATUS.FINALIZED &&
      revenues.length &&
      revenues.every(
        ({ status, type }) =>
          status === REVENUE_STATUS.CLOSED && type !== REVENUE_TYPES.INSURANCE,
      );

    if (shouldBeFinalized) {
      this.update({ loanId, object: { status: LOAN_STATUS.FINALIZED } });
      const formattedPrevStatus = formatMessage({
        id: `Forms.status.${prevStatus}`,
      });
      const formattedNexStatus = formatMessage({
        id: `Forms.status.${LOAN_STATUS.FINALIZED}`,
      });
      const { _id: adminId } = mainAssignee;

      ActivityService.addEventActivity({
        event: ACTIVITY_EVENT_METADATA.LOAN_CHANGE_STATUS,
        details: { prevStatus, nextStatus: LOAN_STATUS.FINALIZED },
        isServerGenerated: true,
        loanLink: { _id: loanId },
        title: 'Statut modifié',
        description: `${formattedPrevStatus} -> ${formattedNexStatus}, automatiquement car tous les revenus ont été encaissés`,
        createdBy: adminId,
      });
    }
  }

  getReusableProperties({ loanId }) {
    const {
      user: { _id: userId } = {},
      properties: currentProperties = [],
    } = this.get(loanId, { user: { _id: 1 }, properties: { _id: 1 } });

    if (!userId) {
      throw new Meteor.Error('No userId found');
    }

    const loans = this.fetch({
      $filters: { userId },
      properties: { address: 1, totalValue: 1 },
    });

    const reusableProperties = loans
      .reduce(
        (allProperties, { properties = [] }) => [
          ...allProperties,
          ...properties,
        ],
        [],
      )
      .filter(
        ({ _id }) => !currentProperties.some(property => _id === property._id),
      );

    return reusableProperties;
  }

  linkProperty({ loanId, propertyId }) {
    this.addLink({ id: loanId, linkName: 'properties', linkId: propertyId });
  }
}

export default new LoanService({});
