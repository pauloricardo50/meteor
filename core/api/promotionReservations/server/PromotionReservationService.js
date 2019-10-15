import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import FileService from 'core/api/files/server/FileService';
import { PROMOTION_OPTION_SOLVENCY } from 'core/api/promotionOptions/promotionOptionConstants';
import { expirePromotionLotBooking } from 'core/api/promotionLots/server/serverMethods';
import TaskService from 'core/api/tasks/server/TaskService';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import PromotionReservations from '../promotionReservations';
import CollectionService from '../../helpers/CollectionService';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import {
  DEPOSIT_STATUSES,
  AGREEMENT_STATUSES,
  PROMOTION_RESERVATION_STATUS,
  PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS,
  PROMOTION_RESERVATION_DOCUMENTS,
  PROMOTION_RESERVATION_LENDER_STATUS,
  PROMOTION_RESERVATIONS_COLLECTION,
} from '../promotionReservationConstants';

class PromotionReservationService extends CollectionService {
  constructor() {
    super(PromotionReservations, {
      autoValues: {
        startDate() {
          if (this.isSet && this.value) {
            return moment(this.value)
              .startOf('day')
              .toDate();
          }
        },
        expirationDate() {
          if (this.isSet && this.value) {
            return moment(this.value)
              .endOf('day')
              .toDate();
          }
        },
      },
    });
  }

  insert = async ({
    promotionReservation,
    promotionOptionId,
    withAgreement = true,
  }) => {
    const {
      promotionLots = [],
      loan = {},
      solvency,
    } = PromotionOptionService.safeFetchOne({
      $filters: { _id: promotionOptionId },
      promotionLots: {
        promotionReservations: { status: 1, expirationDate: 1 },
        promotion: { agreementDuration: 1 },
      },
      loan: { maxPropertyValue: { date: 1 }, verificationStatus: 1 },
      solvency: 1,
    });

    const [
      {
        _id: promotionLotId,
        promotion: { _id: promotionId, agreementDuration },
        promotionReservations = [],
      },
    ] = promotionLots;

    const { _id: loanId } = loan;

    // Check if there's any active promotion reservation on this lot
    if (promotionReservations.length) {
      const activePromotionReservation = promotionReservations.find(({ status }) => status === PROMOTION_RESERVATION_STATUS.ACTIVE);
      if (activePromotionReservation) {
        const { expirationDate } = activePromotionReservation;
        throw new Meteor.Error(`Ce lot est déjà réservé jusqu'au ${moment(expirationDate).format('D MMM YYYY')}`);
      }
    }

    const { startDate, agreementFileKeys = [] } = promotionReservation;
    const expirationDate = this.getExpirationDate({
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

    // Insert promotion reservation
    const promotionReservationId = this.collection.insert({
      ...promotionReservation,
      expirationDate,
      reservationAgreement: {
        date: startDate,
        status: AGREEMENT_STATUSES.SIGNED,
      },
      deposit: { date: startDate, status: DEPOSIT_STATUSES.UNPAID },
      lender: {
        date: startDate,
        status: PROMOTION_RESERVATION_LENDER_STATUS.NONE,
      },
      mortgageCertification: this.getInitialMortgageCertification({
        loan,
        solvency,
        startDate,
      }),
    });

    // Link all related docs
    this.linkAllDocs({
      promotionReservationId,
      promotionOptionId,
      promotionLotId,
      promotionId,
      loanId,
    });

    // Move promotion reservation agreement files to promotion reservation
    await this.mergeAgreementFiles({
      promotionReservationId,
      agreementFileKeys,
    });

    return promotionReservationId;
  };

  getInitialMortgageCertification({ solvency, loan, startDate }) {
    const { maxPropertyValue: { date: maxPropertyValueDate } = {} } = loan;

    let status = PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.UNDETERMINED;
    let date = startDate;

    if (maxPropertyValueDate) {
      switch (solvency) {
      case PROMOTION_OPTION_SOLVENCY.SOLVENT:
        status = PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.SOLVENT;
        break;
      case PROMOTION_OPTION_SOLVENCY.INSOLVENT:
        status = PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.INSOLVENT;
        break;
      default:
        status = PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.CALCULATED;
      }
      date = maxPropertyValueDate;
    } else if (solvency === PROMOTION_OPTION_SOLVENCY.SOLVENT) {
      status = PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.SOLVENT;
    }

    return { status, date };
  }

  getExpirationDate({ startDate, agreementDuration }) {
    // Check if agreement duration is set
    if (!agreementDuration) {
      throw new Meteor.Error('Aucun délai de réservation configuré pour cette promotion');
    }

    const today = moment().startOf('day');
    const startDateLowerBound = moment(today)
      .subtract(Math.ceil(agreementDuration / 2), 'days')
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

  linkAllDocs({
    promotionReservationId,
    promotionOptionId,
    promotionId,
    promotionLotId,
    loanId,
  }) {
    this.addLink({
      id: promotionReservationId,
      linkName: 'promotionOption',
      linkId: promotionOptionId,
    });
    this.addLink({
      id: promotionReservationId,
      linkName: 'promotion',
      linkId: promotionId,
    });
    this.addLink({
      id: promotionReservationId,
      linkName: 'promotionLot',
      linkId: promotionLotId,
    });
    this.addLink({
      id: promotionReservationId,
      linkName: 'loan',
      linkId: loanId,
    });
  }

  mergeAgreementFiles({ promotionReservationId, agreementFileKeys = [] }) {
    return Promise.all(agreementFileKeys.map((Key) => {
      const name = FileService.getFileName(Key);
      return FileService.moveFile({
        Key,
        name,
        newId: PROMOTION_RESERVATION_DOCUMENTS.RESERVATION_AGREEMENT,
        newDocId: promotionReservationId,
        newCollection: PROMOTION_RESERVATIONS_COLLECTION,
      }).then(newKey =>
        FileService.autoRenameFile(newKey, PROMOTION_RESERVATIONS_COLLECTION));
    }));
  }

  updateStatus({ promotionReservationId, status }) {
    return this._update({
      id: promotionReservationId,
      object: { status },
    });
  }

  cancelReservation({ promotionReservationId }) {
    return this.updateStatus({
      promotionReservationId,
      status: PROMOTION_RESERVATION_STATUS.CANCELED,
    });
  }

  completeReservation({ promotionReservationId }) {
    return this.updateStatus({
      promotionReservationId,
      status: PROMOTION_RESERVATION_STATUS.COMPLETED,
    });
  }

  expireReservation({ promotionReservationId }) {
    return this.updateStatus({
      promotionReservationId,
      status: PROMOTION_RESERVATION_STATUS.EXPIRED,
    });
  }

  activateReservation({ promotionReservationId }) {
    return this.updateStatus({
      promotionReservationId,
      status: PROMOTION_RESERVATION_STATUS.ACTIVE,
    });
  }

  updateMortgageCertification({ promotionReservationId, status, date }) {
    return this._update({
      id: promotionReservationId,
      object: { mortgageCertification: { status, date } },
    });
  }

  updateStatusObject({ promotionReservationId, id, object }) {
    const { [id]: model } = this.get(promotionReservationId);
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

    this._update({ id: promotionReservationId, object: updateObject });
  }

  expirePromotionReservations = async () => {
    const today = moment()
      .startOf('day')
      .toDate();

    const promotionReservationsToExpire = this.fetch({
      $filters: {
        expirationDate: { $lte: today },
        status: PROMOTION_RESERVATION_STATUS.ACTIVE,
      },
      promotionOption: { _id: 1 },
    });

    await Promise.all(promotionReservationsToExpire.map(({ promotionOption: { _id: promotionOptionId } }) =>
      expirePromotionLotBooking.run({ promotionOptionId })));

    return promotionReservationsToExpire.length;
  };

  generateExpiringTomorrowTasks = async () => {
    const weekDay = moment().isoWeekday();
    const tomorrow = moment().add(1, 'day');

    // If weekDay is Friday
    if (weekDay === 5) {
      tomorrow.add(2, 'days');
    }

    const promotionReservationsExpiringTomorrow = this.fetch({
      $filters: {
        expirationDate: {
          $lte: tomorrow.startOf('day').toDate(),
        },
        status: PROMOTION_RESERVATION_STATUS.ACTIVE,
      },
      loan: { user: { name: 1 } },
      promotion: { name: 1, assignedEmployee: { _id: 1 } },
      promotionLot: { name: 1 },
      expirationDate: 1,
    });

    await Promise.all(promotionReservationsExpiringTomorrow.map((promotionReservation) => {
      const {
        promotion: { _id: promotionId, assignedEmployee },
        promotionLot: { name: promotionLotName },
        expirationDate,
        loan: {
          user: { name: userName },
        },
      } = promotionReservation;

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
}

export default new PromotionReservationService();
