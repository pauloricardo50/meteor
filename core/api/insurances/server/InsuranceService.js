import { Meteor } from 'meteor/meteor';

import {
  getNewName,
  removeAdminNote,
  setAdminNote,
  updateProNote,
} from '../../helpers/server/collectionServerHelpers';
import CollectionService from '../../helpers/server/CollectionService';
import InsuranceRequestService from '../../insuranceRequests/server/InsuranceRequestService';
import { REVENUE_STATUS } from '../../revenues/revenueConstants';
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
    const result = setAdminNote.bind(this)({
      docId: insuranceId,
      adminNoteId,
      note,
      userId,
    });

    const { _id: insuranceRequestId } =
      InsuranceRequestService.get(
        { 'adminNotes.id': adminNoteId },
        { _id: 1 },
      ) || {};

    // The admin note was linked to the insurance request
    if (insuranceRequestId) {
      InsuranceRequestService.removeAdminNote({
        docId: insuranceRequestId,
        adminNoteId,
      });
    }

    const { _id: oldInsuranceId } =
      this.get(
        { _id: { $ne: insuranceId }, 'adminNotes.id': adminNoteId },
        { _id: 1 },
      ) || {};

    // The admin note was linked to another insurance in the same insurance request
    if (oldInsuranceId) {
      this.removeAdminNote({
        docId: oldInsuranceId,
        adminNoteId,
      });
    }

    return result;
  }

  removeAdminNote(...args) {
    return removeAdminNote.bind(this)(...args);
  }

  updateProNote(...args) {
    return updateProNote.bind(this)(...args);
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

  remove({ insuranceId }) {
    const { revenues = [] } = this.get(insuranceId, {
      revenues: { status: 1 },
    });

    if (
      revenues.filter(({ status }) => status === REVENUE_STATUS.EXPECTED).length
    ) {
      throw new Meteor.Error(
        "Des revenus sont attendus pour cette assurance. Merci de les supprimer manuellement avant de supprimer l'assurance",
      );
    }

    return super.remove(insuranceId);
  }

  updateStatus({ insuranceId, status }) {
    const {
      borrowerLink: { _id: borrowerId } = {},
      insuranceProductLink: { _id: insuranceProductId } = {},
      organisationLink: { _id: organisationId } = {},
    } = this.get(insuranceId, {
      borrowerLink: 1,
      insuranceProductLink: 1,
      organisationLink: 1,
    });

    return this.update({
      insuranceId,
      borrowerId,
      organisationId,
      insuranceProductId,
      insurance: { status },
    });
  }
}

export default new InsuranceService({});
