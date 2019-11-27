import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { asyncForEach } from '../../helpers/index';
import { expirePromotionLotReservation } from '../../promotionLots/server/serverMethods';
import {
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_DOCUMENTS,
  PROMOTION_OPTION_STATUS,
  PROMOTION_OPTIONS_COLLECTION,
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
} from '../promotionOptionConstants';
import LoanService from '../../loans/server/LoanService';
import PromotionLotService from '../../promotionLots/server/PromotionLotService';
import CollectionService from '../../helpers/CollectionService';
import { fullPromotionOption } from '../../fragments';
import PromotionOptions from '../promotionOptions';
import FileService from '../../files/server/FileService';
import {
  PROMOTION_USERS_ROLES,
  PROMOTION_EMAIL_RECIPIENTS,
} from '../../promotions/promotionConstants';
import { shouldAnonymize } from '../../promotions/server/promotionServerHelpers';

export class PromotionOptionService extends CollectionService {
  constructor() {
    super(PromotionOptions, {
      autoValues: {
        'reservationAgreement.startDate': function() {
          if (this.isSet && this.value) {
            return moment(this.value)
              .startOf('day')
              .toDate();
          }
        },
        'reservationAgreement.expirationDate': function() {
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
      promotion: { _id: 1 },
    });

    return promotionOption.promotion;
  }

  remove({ promotionOptionId, isLoanRemoval = false }) {
    const {
      loan: { _id: loanId, promotionOptions },
      promotion: { _id: promotionId },
      status,
    } = this.fetchOne({
      $filters: { _id: promotionOptionId },
      promotion: { _id: 1 },
      loan: { _id: 1, promotionOptions: { _id: 1 } },
      status: 1,
    });

    if (
      [
        PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
        PROMOTION_OPTION_STATUS.RESERVATION_WAITLIST,
        PROMOTION_OPTION_STATUS.RESERVED,
      ].includes(status)
    ) {
      throw new Meteor.Error(
        403,
        "Une réservation est active sur ce lot, veuillez l'annuler d'abord",
      );
    }

    if (!isLoanRemoval && promotionOptions.length === 1) {
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

    const existingPromotionOption =
      promotionOptions &&
      promotionOptions.find(
        ({ promotionLots }) =>
          promotionLots &&
          promotionLots.some(lot => lot._id === promotionLotId),
      );

    if (existingPromotionOption) {
      throw new Meteor.Error(
        'Vous avez déjà choisi ce lot. Essayez de rafraîchir la page.',
      );
    }

    const promotionOptionId = super.insert({
      promotionLotLinks: [{ _id: promotionLotId }],
    });
    this.addLink({
      id: promotionOptionId,
      linkName: 'loan',
      linkId: loanId,
    });
    const {
      promotion: { _id: promotionId },
    } = PromotionLotService.fetchOne({
      $filters: { _id: promotionLotId },
      promotion: { _id: 1 },
    });
    this.addLink({
      id: promotionOptionId,
      linkName: 'promotion',
      linkId: promotionId,
    });
    const priorityOrder = LoanService.getPromotionPriorityOrder({
      loanId,
      promotionId,
    });
    LoanService.setPromotionPriorityOrder({
      loanId,
      promotionId,
      priorityOrder: [...priorityOrder, promotionOptionId],
    });

    this.setInitialSimpleVerification({ promotionOptionId, loanId });

    return promotionOptionId;
  };

  update = ({ promotionOptionId, ...rest }) =>
    this._update({ id: promotionOptionId, ...rest });

  changePriorityOrder({ promotionOptionId, change }) {
    const {
      promotion: { _id: promotionId },
      loan: { _id: loanId },
    } = this.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { _id: 1 },
      promotion: { _id: 1 },
    });
    const priorityOrder = LoanService.getPromotionPriorityOrder({
      loanId,
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
      loanId,
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
    return this._update({ id: promotionOptionId, object: { status } });
  }

  setInitialSimpleVerification({ promotionOptionId, loanId }) {
    const loan = LoanService.fetchOne({
      $filters: { _id: loanId },
      maxPropertyValue: { date: 1 },
    });

    this._update({
      id: promotionOptionId,
      object: {
        simpleVerification: { ...this.getInitialSimpleVerification({ loan }) },
      },
    });
  }

  getInitialSimpleVerification({ loan }) {
    const { maxPropertyValue: { date: maxPropertyValueDate } = {} } = loan;
    let status = PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.INCOMPLETE;
    let date = new Date();

    if (maxPropertyValueDate) {
      date = maxPropertyValueDate;
      status = PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.CALCULATED;
    }

    return { status, date };
  }

  activateReservation({ promotionOptionId }) {
    this.updateStatus({
      promotionOptionId,
      status: PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
    });
  }

  uploadAgreement = async ({
    promotionOptionId,
    startDate,
    agreementFileKeys = [],
    withAgreement = true,
  }) => {
    const {
      promotion: { agreementDuration },
      status,
    } = this.fetchOne({
      $filters: { _id: promotionOptionId },
      promotion: { agreementDuration: 1 },
      status: 1,
    });

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
        await Promise.all(
          agreementFileKeys.map(Key => FileService.getFileFromKey(Key)),
        );
      } catch (error) {
        throw new Meteor.Error('Aucune convention de réservation uploadée');
      }
    }

    this._update({
      id: promotionOptionId,
      object: {
        reservationAgreement: {
          startDate,
          expirationDate,
          date: startDate,
          status: PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED,
        },
        reservationDeposit: {
          status: PROMOTION_OPTION_DEPOSIT_STATUS.WAITING,
          date: startDate,
        },
      },
    });

    await this.mergeReservationAgreementFiles({
      promotionOptionId,
      agreementFileKeys,
    });

    const shouldActivateReservation = [
      PROMOTION_OPTION_STATUS.RESERVATION_CANCELLED,
      PROMOTION_OPTION_STATUS.RESERVATION_EXPIRED,
    ].includes(status);

    if (shouldActivateReservation) {
      this.activateReservation({ promotionOptionId });
    }

    return promotionOptionId;
  };

  getReservationExpirationDate({ startDate, agreementDuration }) {
    // Check if agreement duration is set
    if (!agreementDuration) {
      throw new Meteor.Error(
        'Aucun délai de réservation configuré pour cette promotion',
      );
    }

    const today = moment().startOf('day');
    const startDateLowerBound = moment(today)
      .subtract(agreementDuration, 'days')
      .startOf('day');

    // Check if start date is in future
    if (moment(startDate).startOf('day') > today) {
      throw new Meteor.Error(
        'Le début de la réservation ne peut pas être dans le futur',
      );
    }

    // Check if start date is older than half the agreement duration in the past
    // If not, this reservation does not make sense, it has started too long ago
    if (moment(startDate).startOf('day') < startDateLowerBound) {
      throw new Meteor.Error(
        `Le début de la réservation ne peut pas être avant le ${moment(
          startDateLowerBound,
        ).format('D MMM YYYY')}`,
      );
    }

    const expirationDate = moment(startDate)
      .add(agreementDuration, 'days')
      .toDate();

    return expirationDate;
  }

  mergeReservationAgreementFiles = async ({
    promotionOptionId,
    agreementFileKeys = [],
  }) => {
    const mergeFiles = async () => {
      await asyncForEach(agreementFileKeys, async Key => {
        const name = FileService.getFileName(Key);
        const newKey = await FileService.moveFile({
          Key,
          name,
          newId: PROMOTION_OPTION_DOCUMENTS.RESERVATION_AGREEMENT,
          newDocId: promotionOptionId,
          newCollection: PROMOTION_OPTIONS_COLLECTION,
        });
        await FileService.autoRenameFile(newKey, PROMOTION_OPTIONS_COLLECTION);
      });
    };

    await mergeFiles();
  };

  cancelReservation({ promotionOptionId }) {
    return this.updateStatus({
      promotionOptionId,
      status: PROMOTION_OPTION_STATUS.RESERVATION_CANCELLED,
    });
  }

  completeReservation({ promotionOptionId }) {
    return this.updateStatus({
      promotionOptionId,
      status: PROMOTION_OPTION_STATUS.RESERVED,
    });
  }

  expireReservation({ promotionOptionId }) {
    return this.updateStatus({
      promotionOptionId,
      status: PROMOTION_OPTION_STATUS.RESERVATION_EXPIRED,
    });
  }

  addToWaitList({ promotionOptionId }) {
    this.updateStatus({
      promotionOptionId,
      status: PROMOTION_OPTION_STATUS.RESERVATION_WAITLIST,
    });
    this.setProgress({
      promotionOptionId,
      id: 'bank',
      object: { status: PROMOTION_OPTION_BANK_STATUS.WAITLIST },
    });
  }

  sellLot({ promotionOptionId }) {
    return this.updateStatus({
      promotionOptionId,
      status: PROMOTION_OPTION_STATUS.SOLD,
    });
  }

  setProgress({ promotionOptionId, id, object }) {
    const { [id]: model } = this.fetchOne({
      $filters: { _id: promotionOptionId },
      bank: 1,
      reservationDeposit: 1,
      simpleVerification: 1,
      fullVerification: 1,
      reservationAgreement: 1,
    });
    const changedKeys = Object.keys(object).filter(key => {
      const newValue = object[key] && object[key].valueOf();
      const oldValue = model[key] && model[key].valueOf();

      return newValue && newValue !== oldValue;
    });

    if (!changedKeys.length) {
      return {};
    }

    // Send keys with dot-notation, to make sure simple-schema doesn't
    // set the other keys in the object to their defaultValues
    changedKeys.forEach(key => {
      this._update({
        id: promotionOptionId,
        object: { [`${id}.${key}`]: object[key] },
      });
    });

    if (changedKeys.includes('status')) {
      return {
        prevStatus: model.status,
        nextStatus: object.status,
      };
    }

    return {};
  }

  expireReservations = () => {
    const yesterdayNight = moment()
      .subtract(1, 'day')
      .endOf('day')
      .toDate();

    const toExpire = this.fetch({
      $filters: {
        'reservationAgreement.expirationDate': { $lte: yesterdayNight },
        status: PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
      },
    });

    return Promise.all(
      toExpire.map(({ _id: promotionOptionId }) =>
        expirePromotionLotReservation.run({ promotionOptionId }),
      ),
    );
  };

  getExpiringSoonReservations = () => {
    const weekDay = moment().isoWeekday();
    const tomorrow = moment().add(1, 'day');

    // If weekDay is Friday
    if (weekDay === 5) {
      tomorrow.add(2, 'days');
    }

    const expiringSoon = this.fetch({
      $filters: {
        'reservationAgreement.expirationDate': {
          $gte: moment()
            .endOf('day')
            .toDate(),
          $lte: tomorrow.endOf('day').toDate(),
        },
        status: PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
      },
      loan: { user: { name: 1 } },
      promotion: { name: 1, assignedEmployee: { _id: 1 } },
      promotionLots: { name: 1 },
      reservationAgreement: { expirationDate: 1 },
    });

    return expiringSoon;
  };

  getHalfLifeReservations = () => {
    const in10Days = moment().add(10, 'days');
    const in9Days = moment().add(9, 'days');

    const expiringIn10Days = this.fetch({
      $filters: {
        'reservationAgreement.expirationDate': {
          $lte: in10Days.startOf('day').toDate(),
          $gte: in9Days.startOf('day').toDate(),
        },
        status: PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
      },
      loan: { user: { name: 1 } },
      promotion: { name: 1, assignedEmployee: { _id: 1 } },
      promotionLots: { name: 1 },
      reservationAgreement: { expirationDate: 1 },
    });

    return expiringIn10Days;
  };

  getEmailRecipients({ promotionOptionId }) {
    const promotionOption = this.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: {
        user: {
          email: 1,
          assignedEmployee: { email: 1 },
        },
        promotions: { _id: 1 },
      },
      promotion: { users: { email: 1 } },
      promotionLots: { _id: 1 },
    });

    const {
      loan: {
        _id: loanId,
        user: {
          _id: customerId,
          email: userEmail,
          assignedEmployee: { email: adminEmail, _id: adminId } = {},
        },
        promotions = [],
      },
      promotion: { _id: promotionId, users: promotionUsers = [] },
      promotionLots = [],
    } = promotionOption;

    const [
      {
        $metadata: { invitedBy },
      },
    ] = promotions;
    const [{ _id: promotionLotId }] = promotionLots;

    const mapAnonymize = ({ email, _id: userId }) => ({
      userId,
      email,
      anonymize: shouldAnonymize({
        customerId,
        promotionId,
        promotionLotId,
        loanId,
        userId,
      }),
    });

    const filterEnableNotifications = ({
      $metadata: { enableNotifications = true },
    }) => enableNotifications;
    const makeFilterRole = role => ({ $metadata: { roles = [] } }) =>
      roles.includes(role);

    const user = [{ userId: customerId, email: userEmail, anonymize: false }];
    const admin = [{ userId: adminId, email: adminEmail, anonymize: false }];
    const broker = [
      {
        _id: invitedBy,
        email: promotionUsers.find(({ _id }) => _id === invitedBy).email,
      },
    ].map(mapAnonymize);

    const recipients = [
      {
        type: PROMOTION_EMAIL_RECIPIENTS.PROMOTER,
        role: PROMOTION_USERS_ROLES.PROMOTER,
        withNotificationsFilter: false,
        withMapAnonymize: true,
      },
      {
        type: PROMOTION_EMAIL_RECIPIENTS.BROKERS,
        role: PROMOTION_USERS_ROLES.BROKER,
        withNotificationsFilter: true,
        withMapAnonymize: true,
        customFilter: ({ email }) =>
          !broker.some(({ email: brokerEmail }) => brokerEmail === email),
      },
      {
        type: PROMOTION_EMAIL_RECIPIENTS.NOTARY,
        role: PROMOTION_USERS_ROLES.NOTARY,
        withNotificationsFilter: true,
        withMapAnonymize: true,
      },
    ].reduce(
      (
        object,
        { type, role, withMapAnonymize, withNotificationsFilter, customFilter },
      ) => {
        let recipient = promotionUsers.filter(makeFilterRole(role));
        if (withNotificationsFilter) {
          recipient = recipient.filter(filterEnableNotifications);
        }
        if (customFilter) {
          recipient = recipient.filter(customFilter);
        }
        if (withMapAnonymize) {
          recipient = recipient.map(mapAnonymize);
        }
        return { ...object, [type]: recipient };
      },
      {},
    );

    return {
      [PROMOTION_EMAIL_RECIPIENTS.USER]: user,
      [PROMOTION_EMAIL_RECIPIENTS.ADMIN]: admin,
      [PROMOTION_EMAIL_RECIPIENTS.BROKER]: broker,
      ...recipients,
    };
  }
}

export default new PromotionOptionService();
