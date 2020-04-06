import { Random } from 'meteor/random';

import { getNewName } from '../../helpers/server/collectionServerHelpers';
import CollectionService from '../../helpers/server/CollectionService';
import InsuranceRequestService from '../../insuranceRequests/server/InsuranceRequestService';
import { getEffectiveDuration } from '../helpers';
import { INSURANCES_COLLECTION, INSURANCE_STATUS } from '../insuranceConstants';
import Insurances from '../insurances';

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
      insuranceProduct: { revaluationFactor: 1, maxProductionYears: 1 },
      duration: 1,
      premium: 1,
      premiumFrequency: 1,
    });

    return activeInsurances.reduce(
      (
        totalProduction,
        {
          insuranceProduct: { revaluationFactor, maxProductionYears },
          duration,
          premium,
          premiumFrequency,
        },
      ) => {
        const effectiveDuration = getEffectiveDuration({
          premiumFrequency,
          duration,
          maxProductionYears,
        });
        return (
          totalProduction + premium * effectiveDuration * revaluationFactor
        );
      },
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

  getEstimatedRevenue({ insuranceId }) {
    const {
      organisation: { productionRate },
      duration,
      premium,
      premiumFrequency,
      insuranceProduct: { revaluationFactor, maxProductionYears },
    } = this.get(insuranceId, {
      premium: 1,
      premiumFrequency: 1,
      duration: 1,
      insuranceProduct: { revaluationFactor: 1, maxProductionYears: 1 },
      organisation: { productionRate: 1 },
    });

    const effectiveDuration = getEffectiveDuration({
      premiumFrequency,
      duration,
      maxProductionYears,
    });

    return Math.round(
      premium * effectiveDuration * revaluationFactor * productionRate,
    );
  }
}

export default new InsuranceService({});
