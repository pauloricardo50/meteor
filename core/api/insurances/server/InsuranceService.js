import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import moment from 'moment';

import { getNewName } from 'core/api/helpers/server/collectionServerHelpers';
import {
  REVENUE_STATUS,
  REVENUE_TYPES,
} from 'core/api/revenues/revenueConstants';
import RevenueService from 'core/api/revenues/server/RevenueService';
import CollectionService from '../../helpers/server/CollectionService';
import Insurances from '../insurances';
import InsuranceRequestService from '../../insuranceRequests/server/InsuranceRequestService';
import {
  INSURANCE_STATUS,
  INSURANCES_COLLECTION,
  INSURANCE_PREMIUM_FREQUENCY,
} from '../insuranceConstants';
import { getEffectiveDuration } from '../helpers';

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

  addRecurrentRevenues({ insuranceId, managementRate, assigneeId }) {
    const {
      premium,
      premiumFrequency,
      duration,
      startDate,
      insuranceProduct: { name: insuranceProductName },
      organisation: { _id: organisationId },
    } = this.get(insuranceId, {
      premium: 1,
      premiumFrequency: 1,
      duration: 1,
      startDate: 1,
      insuranceProduct: { name: 1 },
      organisation: { _id: 1 },
    });

    if (premiumFrequency === INSURANCE_PREMIUM_FREQUENCY.SINGLE) {
      throw new Meteor.Error(
        'Les assurances à prime unique ne peuvent pas avoir de revenus récurrents',
      );
    }

    const amount = premium * managementRate;

    let monthIncrement = 0;

    switch (premiumFrequency) {
      case INSURANCE_PREMIUM_FREQUENCY.MONTHLY:
        monthIncrement = 1;
        break;
      case INSURANCE_PREMIUM_FREQUENCY.QUARTERLY:
        monthIncrement = 3;
        break;
      case INSURANCE_PREMIUM_FREQUENCY.BIANNUAL:
        monthIncrement = 6;
        break;
      case INSURANCE_PREMIUM_FREQUENCY.YEARLY:
        monthIncrement = 12;
        break;
      default:
        break;
    }

    const firstRevenueDate = moment(startDate)
      .add(1, 'month')
      .endOf('month');

    let revenueDates = [firstRevenueDate];

    for (
      let increment = monthIncrement;
      increment < duration;
      increment += monthIncrement
    ) {
      revenueDates = [
        ...revenueDates,
        firstRevenueDate.add(increment, 'months').endOf('month'),
      ];
    }

    revenueDates.forEach(date => {
      const revenueId = RevenueService.insert({
        revenue: {
          amount,
          description: insuranceProductName,
          type: REVENUE_TYPES.INSURANCE,
          expectedAt: date.toDate(),
          sourceOrganisationLink: { _id: organisationId },
          assigneeLink: { _id: assigneeId },
        },
      });
      this.addLink({
        id: insuranceId,
        linkName: 'revenues',
        linkId: revenueId,
        metadata: { recurrent: true, managementRate },
      });
    });
  }

  updateRecurrentRevenues({ insuranceId, managementRate, amount }) {
    if ((amount && managementRate) || (!amount && !managementRate)) {
      throw new Meteor.Error(
        'Vous devez modifier le montant ou le taux de gestion',
      );
    }

    const { revenues = [], premium } = this.get(insuranceId, {
      revenues: { _id: 1, status: 1 },
      premium: 1,
    });
    const recurrentRevenues = revenues.filter(
      ({ status, $metadata }) =>
        status === REVENUE_STATUS.EXPECTED && $metadata?.recurrent === true,
    );

    let newAmount;
    let newManagementRate = managementRate;
    if (managementRate) {
      newAmount = managementRate * premium;
    } else if (amount) {
      newAmount = amount;
      newManagementRate = newAmount / premium;
    }

    recurrentRevenues.forEach(({ _id: revenueId }) => {
      RevenueService._update({ id: revenueId, object: { amount: newAmount } });
      this.updateLinkMetadata({
        id: insuranceId,
        linkName: 'revenues',
        linkId: revenueId,
        metadata: { recurrent: true, managementRate: newManagementRate },
      });
    });
  }

  removeReccurentRevenues({ insuranceId }) {
    const { revenues = [] } = this.get(insuranceId, {
      revenues: { _id: 1, status: 1 },
    });
    const recurrentRevenues = revenues.filter(
      ({ status, $metadata }) =>
        status === REVENUE_STATUS.EXPECTED && $metadata?.recurrent === true,
    );

    recurrentRevenues.forEach(({ _id: revenueId }) =>
      RevenueService.remove({ revenueId }),
    );
  }
}

export default new InsuranceService({});
