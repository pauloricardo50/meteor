import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { LOAN_VERIFICATION_STATUS } from 'core/api/loans/loanConstants';
import { AGREEMENT_STATUSES } from 'core/api/promotionOptions/promotionOptionConstants';
import FileService from 'core/api/files/server/FileService';
import PromotionReservations from '../promotionReservations';
import CollectionService from '../../helpers/CollectionService';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';
import {
  PROMOTION_RESERVATION_STATUS,
  PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS,
  PROMOTION_RESERVATION_DOCUMENTS,
} from '../promotionReservationConstants';

class PromotionReservationService extends CollectionService {
  constructor() {
    super(PromotionReservations);
  }

  insert({ promotionReservation, promotionOptionId }) {
    const {
      promotionLots = [],
      loan = {},
    } = PromotionOptionService.safeFetchOne({
      $filters: { _id: promotionOptionId },
      promotionLots: {
        promotionReservations: { status: 1, expirationDate: 1 },
        promotion: { agreementDuration: 1 },
      },
      loan: { maxPropertyValue: { date: 1 }, verificationStatus: 1 },
    });

    const [
      {
        _id: promotionLotId,
        promotion: { _id: promotionId, agreementDuration },
        promotionReservations = [],
      },
    ] = promotionLots;

    // Check if there's any active promotion reservation on this lot
    if (promotionReservations.length) {
      const activePromotionReservation = promotionReservations.find(({ status }) => status === PROMOTION_RESERVATION_STATUS.ACTIVE);
      if (activePromotionReservation) {
        const { expirationDate } = activePromotionReservation;
        throw new Meteor.Error(`Ce lot est déjà réservé jusqu'au ${moment(expirationDate).format('D MMM YYYY')}`);
      }
    }

    // Check if agreement duration is set
    if (!agreementDuration) {
      throw new Meteor.Error('Aucun délai de réservation configuré pour cette promotion');
    }

    const { startDate, agreementFileKeys = [] } = promotionReservation;

    // Check if promotion reservation agreement has been uploaded
    if (
      !agreementFileKeys.length
      || agreementFileKeys.some(Key => !FileService.getFileFromKey(Key))
    ) {
      throw new Meteor.Error('Aucune convention de réservation uploadée');
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
    if (moment(startDate).startOf('day') < startDateLowerBound) {
      throw new Meteor.Error('Le début de la réservation ne peut pas être antérieur à la moitié de la durée de réservation');
    }

    const expirationDate = moment(startDate)
      .add(agreementDuration, 'days')
      .startOf('day')
      .toDate();

    const {
      _id: loanId,
      maxPropertyValue: { date: maxPropertyValueDate } = {},
      verificationStatus,
    } = loan;

    // Insert promotion reservation
    const promotionReservationId = this.collection.insert({
      ...promotionReservation,
      agreement: { date: startDate, status: AGREEMENT_STATUSES.SIGNED },
      expirationDate,
      mortgageCertification: {
        status: maxPropertyValueDate
          ? verificationStatus === LOAN_VERIFICATION_STATUS.OK
            ? PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.VALIDATED
            : PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.CALCULATED
          : PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.NONE,
        date: maxPropertyValueDate,
      },
    });

    // Link all related docs
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

    // Move promotion reservation agreement files to promotion reservation
    agreementFileKeys.forEach((Key) => {
      const name = FileService.getFileName(Key);
      FileService.moveFile({
        Key,
        name,
        newId: PROMOTION_RESERVATION_DOCUMENTS.RESERVATION_AGREEMENT,
        newDocId: promotionReservationId,
        newCollection: this.collection._name,
      });
    });

    return promotionReservationId;
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

  updateMortgageCertification({ promotionReservationId, status, date }) {
    return this._update({
      id: promotionReservationId,
      object: { status, date },
    });
  }
}

export default new PromotionReservationService();
