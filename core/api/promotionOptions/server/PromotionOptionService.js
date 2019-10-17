import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { expirePromotionLotBooking } from '../../promotionLots/server/serverMethods';
import {
  PROMOTION_OPTION_MORTGAGE_CERTIFICATION_STATUS,
  AGREEMENT_STATUSES,
  DEPOSIT_STATUSES,
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_DOCUMENTS,
  PROMOTION_OPTION_STATUS,
  PROMOTION_OPTIONS_COLLECTION,
} from '../promotionOptionConstants';
import LoanService from '../../loans/server/LoanService';
import CollectionService from '../../helpers/CollectionService';
import { fullPromotionOption } from '../../fragments';
import PromotionOptions from '../promotionOptions';
import FileService from '../../files/server/FileService';
import TaskService from '../../tasks/server/TaskService';
import { PROMOTIONS_COLLECTION } from '../../promotions/promotionConstants';

export class PromotionOptionService extends CollectionService {
  constructor() {
    super(PromotionOptions, {
      autoValues: {
        'reservationAgreement.startDate': function () {
          if (this.isSet && this.value) {
            return moment(this.value)
              .startOf('day')
              .toDate();
          }
        },
        'reservationAgreement.expirationDate': function () {
          if (this.isSet && this.value) {
            return moment(this.value)
              .endOf('day')
              .toDate();
          }
        },
      },
    });
  }

  get(promotionOptionId) {
    return this.collection
      .createQuery({
        $filters: { _id: promotionOptionId },
        ...fullPromotionOption(),
      })
      .fetchOne();
  }

  getPromotion(promotionOptionId) {
    const promotionOption = this.fetchOne({
      $filters: { _id: promotionOptionId },
      promotionLots: { promotion: { _id: 1 } },
    });

    return (
      promotionOption.promotionLots
      && promotionOption.promotionLots[0].promotion
    );
  }

  remove({ promotionOptionId }) {
    const {
      loan: { _id: loanId, promotionOptions },
      promotion: { _id: promotionId },
      status,
    } = this.fetchOne({
      $filters: { _id: promotionOptionId },
      promotion: 1,
      loan: { _id: 1, promotionOptions: { _id: 1 } },
    });

    if (
      [
        PROMOTION_OPTION_STATUS.ACTIVE,
        PROMOTION_OPTION_STATUS.COMPLETED,
      ].includes(status)
    ) {
      throw new Meteor.Error(
        403,
        "Une réservation est active sur ce lot, veuillez l'annuler d'abord",
      );
    }

    if (promotionOptions.length === 1) {
      throw new Meteor.Error(
        403,
        'Vous devez choisir au moins un lot dans la promotion',
      );
    }

    const newPriorityOrder = LoanService.getPromotionPriorityOrder({
      loanId,
      promotionId,
    }).filter(id => id !== promotionOptionId);
    LoanService.setPromotionPriorityOrder({
      loanId,
      promotionId,
      priorityOrder: newPriorityOrder,
    });

    return super.remove(promotionOptionId);
  }

  insert = ({ promotionLotId, loanId }) => {
    const { promotionOptions } = LoanService.fetchOne({
      $filters: { _id: loanId },
      promotionOptions: { _id: 1, promotionLots: { _id: 1 } },
    });

    const existingPromotionOption = promotionOptions
      && promotionOptions.find(({ promotionLots }) =>
        promotionLots
          && promotionLots.some(lot => lot._id === promotionLotId));

    if (existingPromotionOption) {
      throw new Meteor.Error('Vous avez déjà choisi ce lot. Essayez de rafraîchir la page.');
    }

    const promotionOptionId = super.insert({
      promotionLotLinks: [{ _id: promotionLotId }],
    });
    LoanService.addLink({
      id: loanId,
      linkName: 'promotionOptions',
      linkId: promotionOptionId,
    });
    const promotionId = this.getPromotion(promotionOptionId)._id;
    const priorityOrder = LoanService.getPromotionPriorityOrder({
      loanId,
      promotionId,
    });
    LoanService.setPromotionPriorityOrder({
      loanId,
      promotionId,
      priorityOrder: [...priorityOrder, promotionOptionId],
    });

    this.setInitialMortgageCertification({ promotionOptionId, loanId });

    return promotionOptionId;
  };

  update = ({ promotionOptionId, ...rest }) =>
    this._update({ id: promotionOptionId, ...rest });

  changePriorityOrder({ promotionOptionId, change }) {
    const promotionOption = this.get(promotionOptionId);
    const { loan } = promotionOption;
    const { _id: promotionId } = this.getPromotion(promotionOptionId);
    const priorityOrder = LoanService.getPromotionPriorityOrder({
      loanId: loan._id,
      promotionId,
    });
    const optionIndex = priorityOrder.indexOf(promotionOptionId);

    if (change < 0 && optionIndex === 0) {
      return false;
    }

    if (change > 0 && optionIndex === priorityOrder.length - 1) {
      return false;
    }

    const newPriorityOrder = priorityOrder.slice();
    newPriorityOrder[optionIndex] = priorityOrder[optionIndex + change];
    newPriorityOrder[optionIndex + change] = promotionOptionId;

    return LoanService.setPromotionPriorityOrder({
      loanId: loan._id,
      promotionId,
      priorityOrder: newPriorityOrder,
    });
  }

  increasePriorityOrder({ promotionOptionId }) {
    return this.changePriorityOrder({ promotionOptionId, change: -1 });
  }

  reducePriorityOrder({ promotionOptionId }) {
    return this.changePriorityOrder({ promotionOptionId, change: 1 });
  }

  updateStatus({ promotionOptionId, status }) {
    this._update({ id: promotionOptionId, status });
  }

  requestReservation({ promotionOptionId }) {
    this.updateStatus({
      promotionOptionId,
      status: PROMOTION_OPTION_STATUS.RESERVATION_REQUESTED,
    });
  }

  updateMortgageCertification({ promotionOptionId, status, date }) {
    return this._update({
      id: promotionOptionId,
      object: { mortgageCertification: { status, date } },
    });
  }

  setInitialMortgageCertification({ promotionOptionId, loanId }) {
    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      maxPropertyValue: { date: 1 },
    });

    this.updateMortgageCertification({
      promotionOptionId,
      ...this.getInitialMortgageCertification({ loan }),
    });
  }

  getInitialMortgageCertification({ loan }) {
    const { maxPropertyValue: { date: maxPropertyValueDate } = {} } = loan;
    let status = PROMOTION_OPTION_MORTGAGE_CERTIFICATION_STATUS.UNDETERMINED;
    let date = new Date();

    if (maxPropertyValueDate) {
      date = maxPropertyValueDate;
      status = PROMOTION_OPTION_MORTGAGE_CERTIFICATION_STATUS.TO_BE_VERIFIED;
    }

    return { status, date };
  }

  activateReservation = async ({
    promotionOptionId,
    startDate,
    agreementFileKeys = [],
    withAgreement = true,
  }) => {
    const { promotionLots = [] } = this.fetchOne({
      $filters: { _id: promotionOptionId },
      promotionLots: {
        promotion: { agreementDuration: 1 },
        promotionOptions: {
          status: 1,
          reservationAgreement: { expirationDate: 1 },
        },
      },
    });

    const [
      {
        promotionOptions = [],
        promotion: { agreementDuration },
      },
    ] = promotionLots;

    // Check if there's any active reservation on this lot
    if (promotionOptions.length) {
      const activeReservation = promotionOptions.find(({ status }) => status === PROMOTION_OPTION_STATUS.ACTIVE);

      if (activeReservation) {
        const {
          reservationAgreement: { expirationDate },
        } = activeReservation;
        throw new Meteor.Error(`Ce lot est déjà réservé jusqu'au ${moment(expirationDate).format('D MMM YYYY')}`);
      }
    }

    const expirationDate = this.getReservationExpirationDate({
      startDate,
      agreementDuration,
    });

    // Check if promotion reservation agreement has been uploaded
    if (withAgreement) {
      try {
        if (!agreementFileKeys.length) {
          throw new Error();
        }
        await Promise.all(agreementFileKeys.map(Key => FileService.getFileFromKey(Key)));
      } catch (error) {
        throw new Meteor.Error('Aucune convention de réservation uploadée');
      }
    }

    this._update({
      id: promotionOptionId,
      object: {
        status: PROMOTION_OPTION_STATUS.ACTIVE,
        reervationAgreement: {
          startDate,
          expirationDate,
          date: startDate,
          status: AGREEMENT_STATUSES.SIGNED,
        },
        deposit: { date: startDate, status: DEPOSIT_STATUSES.UNPAID },
        bank: {
          date: startDate,
          status: PROMOTION_OPTION_BANK_STATUS.NONE,
        },
      },
    });

    await this.mergeReservationAgreementFiles({
      promotionOptionId,
      agreementFileKeys,
    });
  };

  getReservationExpirationDate({ startDate, agreementDuration }) {
    // Check if agreement duration is set
    if (!agreementDuration) {
      throw new Meteor.Error('Aucun délai de réservation configuré pour cette promotion');
    }

    const today = moment().startOf('day');
    const startDateLowerBound = moment(today)
      .subtract(agreementDuration, 'days')
      .startOf('day');

    // Check if start date is in future
    if (moment(startDate).startOf('day') > today) {
      throw new Meteor.Error('Le début de la réservation ne peut pas être dans le futur');
    }

    // Check if start date is older than half the agreement duration in the past
    // If not, this reservation does not make sense, it has started too long ago
    if (moment(startDate).startOf('day') < startDateLowerBound) {
      throw new Meteor.Error('Le début de la réservation ne peut pas être antérieur à la moitié de la durée de réservation');
    }

    const expirationDate = moment(startDate)
      .add(agreementDuration, 'days')
      .toDate();

    return expirationDate;
  }

  mergeReservationAgreementFiles({
    promotionOptionId,
    agreementFileKeys = [],
  }) {
    return Promise.all(agreementFileKeys.map((Key) => {
      const name = FileService.getFileName(Key);
      return FileService.moveFile({
        Key,
        name,
        newId: PROMOTION_OPTION_DOCUMENTS.RESERVATION_AGREEMENT,
        newDocId: promotionOptionId,
        newCollection: PROMOTION_OPTIONS_COLLECTION,
      }).then(newKey =>
        FileService.autoRenameFile(newKey, PROMOTION_OPTIONS_COLLECTION));
    }));
  }

  cancelReservation({ promotionOptionId }) {
    return this.updateStatus({
      promotionOptionId,
      status: PROMOTION_OPTION_STATUS.CANCELED,
    });
  }

  completeReservation({ promotionOptionId }) {
    return this.updateStatus({
      promotionOptionId,
      status: PROMOTION_OPTION_STATUS.COMPLETED,
    });
  }

  expireReservation({ promotionOptionId }) {
    return this.updateStatus({
      promotionOptionId,
      status: PROMOTION_OPTION_STATUS.EXPIRED,
    });
  }

  updateStatusObject({ promotionOptionId, id, object }) {
    const { [id]: model } = this.get(promotionOptionId);
    const changedKeys = Object.keys(object).filter(key => object[key].valueOf() !== model[key].valueOf());

    if (!changedKeys.length) {
      return;
    }

    // Send keys with dot-notation, to make sure simple-schema doesn't
    // set the other keys in the object to their defaultValues
    const updateObject = changedKeys.reduce(
      (obj, key) => ({ ...obj, [`${id}.${key}`]: object[key] }),
      {},
    );

    this._update({
      id: promotionOptionId,
      object: updateObject,
    });
  }

  expireReservations = async () => {
    const today = moment()
      .startOf('day')
      .toDate();

    const toExpire = this.fetch({
      $filters: {
        'reservationAgreement.expirationDate': { $lte: today },
        status: PROMOTION_OPTION_STATUS.ACTIVE,
      },
    });

    await Promise.all(toExpire.map(({ _id: promotionOptionId }) =>
      expirePromotionLotBooking.run({ promotionOptionId })));

    return toExpire.length;
  };

  generateExpiringSoonTasks = async () => {
    const weekDay = moment().isoWeekday();
    const tomorrow = moment().add(1, 'day');

    // If weekDay is Friday
    if (weekDay === 5) {
      tomorrow.add(2, 'days');
    }

    const expiringSoon = this.fetch({
      $filters: {
        'reservationAgreement.expirationDate': {
          $lte: tomorrow.startOf('day').toDate(),
        },
        status: PROMOTION_OPTION_STATUS.ACTIVE,
      },
      loan: { user: { name: 1 } },
      promotion: { name: 1, assignedEmployee: { _id: 1 } },
      promotionLots: { name: 1 },
      reservationAgreement: { expirationDate: 1 },
    });

    await Promise.all(expiringSoon.map((promotionOption) => {
      const {
        promotion: { _id: promotionId, assignedEmployee },
        promotionLots = [],
        reservationAgreement: { expirationDate },
        loan: {
          user: { name: userName },
        },
      } = promotionOption;

      const [{ name: promotionLotName }] = promotionLots;

      return TaskService.insert({
        object: {
          collection: PROMOTIONS_COLLECTION,
          docId: promotionId,
          assigneeLink: assignedEmployee,
          title: `La réservation de ${userName} sur ${promotionLotName} arrive à échéance`,
          description: `Valable jusqu'au ${moment(expirationDate).format('DD MMM')}`,
        },
      });
    }));
  };

  generateHalfLifeReminderTasks = async () => {
    const in10Days = moment().add(10, 'days');

    const expiringIn10Days = this.fetch({
      $filters: {
        'reservationAgreement.expirationDate': {
          $lte: in10Days.startOf('day').toDate(),
        },
        status: PROMOTION_OPTION_STATUS.ACTIVE,
      },
      loan: { user: { name: 1 } },
      promotion: { name: 1, assignedEmployee: { _id: 1 } },
      promotionLot: { name: 1 },
      reservationAgreement: { expirationDate: 1 },
    });

    await Promise.all(expiringIn10Days.map((promotionOption) => {
      const {
        promotion: { _id: promotionId, assignedEmployee },
        promotionLots = [],
        reservationAgreement: { expirationDate },
        loan: {
          user: { name: userName },
        },
      } = promotionOption;

      const [{ name: promotionLotName }] = promotionLots;

      return TaskService.insert({
        object: {
          collection: PROMOTIONS_COLLECTION,
          docId: promotionId,
          assigneeLink: assignedEmployee,
          title: `La réservation de ${userName} sur ${promotionLotName} échoue dans 10 jours, relancer le client`,
          description: `Valable jusqu'au ${moment(expirationDate).format('DD MMM')}`,
        },
      });
    }));
  };
}

export default new PromotionOptionService();
