import { Random } from 'meteor/random';
import moment from 'moment';

import { getNewName } from 'core/api/helpers/server/collectionServerHelpers';
import CollectionService from '../../helpers/server/CollectionService';
import Insurances from '../insurances';
import InsuranceRequestService from '../../insuranceRequests/server/InsuranceRequestService';
import {
  INSURANCE_STATUS,
  INSURANCES_COLLECTION,
  INSURANCE_PREMIUM_FREQUENCY,
} from '../insuranceConstants';

class InsuranceService extends CollectionService {
  constructor() {
    super(Insurances);
  }

  insert = ({
    insuranceRequestId,
    borrowerId,
    organisationId,
    insuranceProductId,
    insurance = {},
  }) => {
    const name = getNewName({
      collection: INSURANCES_COLLECTION,
      insuranceRequestId,
    });
    const insuranceId = super.insert({ ...insurance, name });
    this.addLink({
      id: insuranceId,
      linkName: 'insuranceRequest',
      linkId: insuranceRequestId,
    });
    this.addLink({ id: insuranceId, linkName: 'borrower', linkId: borrowerId });
    this.addLink({
      id: insuranceId,
      linkName: 'organisation',
      linkId: organisationId,
    });
    this.addLink({
      id: insuranceId,
      linkName: 'insuranceProduct',
      linkId: insuranceProductId,
    });

    InsuranceRequestService.calculateNewStatus({ insuranceRequestId });

    return insuranceId;
  };

  getGeneratedProductions = ({ organisationId }) => {
    const activeInsurances = this.fetch({
      $filters: {
        'organisationLink._id': organisationId,
        status: INSURANCE_STATUS.POLICED,
      },
      insuranceProduct: { revaluationFactor: 1 },
      duration: 1,
      premium: 1,
    });

    return activeInsurances.reduce(
      (
        totalProduction,
        { insuranceProduct: { revaluationFactor }, duration, premium },
      ) => totalProduction + premium * duration * revaluationFactor,
      0,
    );
  };

  update = ({
    insuranceId,
    borrowerId,
    organisationId,
    insuranceProductId,
    insurance = {},
  }) => {
    const response = this._update({
      id: insuranceId,
      object: {
        ...insurance,
        'borrowerLink._id': borrowerId,
        'insuranceProductLink._id': insuranceProductId,
        'organisationLink._id': organisationId,
      },
    });

    const { insuranceRequest } = this.get(insuranceId, {
      insuranceRequest: { _id: 1 },
    });

    InsuranceRequestService.calculateNewStatus({
      insuranceRequestId: insuranceRequest._id,
    });

    return response;
  };

  setAdminNote({ insuranceId, adminNoteId, note, userId }) {
    let result;
    const now = new Date();
    const formattedNote = {
      ...note,
      updatedBy: userId,
      date: note.date || now,
    };

    if (formattedNote.date.getTime() > now.getTime()) {
      throw new Meteor.Error('Les dates dans le futur ne sont pas autorisées');
    }

    const { adminNotes: currentAdminNotes = [] } = this.get(insuranceId, {
      adminNotes: 1,
    });

    const adminNoteExists =
      adminNoteId && currentAdminNotes.find(({ id }) => id === adminNoteId);

    if (adminNoteExists) {
      result = this.baseUpdate(
        { _id: insuranceId, 'adminNotes.id': adminNoteId },
        { $set: { 'adminNotes.$': { ...formattedNote, id: adminNoteId } } },
      );
    } else {
      const { _id: insuranceRequestId } = adminNoteId
        ? InsuranceRequestService.get(
            { 'adminNotes.id': adminNoteId },
            { _id: 1 },
          )
        : {};

      if (insuranceRequestId) {
        InsuranceRequestService.removeAdminNote({
          insuranceRequestId,
          adminNoteId,
        });
      }

      result = this._update({
        id: insuranceId,
        operator: '$push',
        object: { adminNotes: { ...formattedNote, id: Random.id() } },
      });
    }

    // Sort adminNotes by date for faster retrieval of recent notes
    // Most recent is always at the top
    const { adminNotes } = this.get(insuranceId, { adminNotes: 1 });
    this._update({
      id: insuranceId,
      object: {
        adminNotes: adminNotes.sort(
          ({ date: a }, { date: b }) => new Date(b) - new Date(a),
        ),
      },
    });

    this.updateProNote({ insuranceId });

    return result;
  }

  removeAdminNote({ insuranceId, adminNoteId }) {
    const result = this.baseUpdate(insuranceId, {
      $pull: { adminNotes: { id: adminNoteId } },
    });

    this.updateProNote({ insuranceId });

    return result;
  }

  updateProNote({ insuranceId }) {
    const { adminNotes } = this.get(insuranceId, { adminNotes: 1 });
    const proNote = adminNotes.find(note => note.isSharedWithPros);

    if (proNote) {
      return this._update({ id: insuranceId, object: { proNote } });
    }

    return this._update({
      id: insuranceId,
      operator: '$unset',
      object: { proNote: true },
    });
  }

  getInsuranceDuration({ insuranceId }) {
    const { startDate, endDate, premiumFrequency } = this.get(insuranceId, {
      startDate: 1,
      endDate: 1,
      premiumFrequency: 1,
    });
    const rawDuration = moment.duration(
      moment(endDate).diff(moment(startDate)),
    );

    switch (premiumFrequency) {
      case INSURANCE_PREMIUM_FREQUENCY.SINGLE:
        return 1;
      case INSURANCE_PREMIUM_FREQUENCY.MONTHLY:
        return Math.round(rawDuration.asMonths());
      case INSURANCE_PREMIUM_FREQUENCY.QUARTERLY:
        return Math.round(rawDuration.asMonths() / 3);
      case INSURANCE_PREMIUM_FREQUENCY.BIANNUAL:
        return Math.round(rawDuration.asYears() * 2);
      case INSURANCE_PREMIUM_FREQUENCY.YEARLY:
        return Math.round(rawDuration.asYears());
      default:
        return 0;
    }
  }

  getEstimatedRevenue({ insuranceId }) {
    const {
      organisation: { productionRate },
      duration,
      premium,
      insuranceProduct: { revaluationFactor },
    } = this.get(insuranceId, {
      premium: 1,
      duration: 1,
      insuranceProduct: { revaluationFactor: 1 },
      organisation: { productionRate: 1 },
    });

    return Math.round(premium * duration * revaluationFactor * productionRate);
  }
}

export default new InsuranceService({});
