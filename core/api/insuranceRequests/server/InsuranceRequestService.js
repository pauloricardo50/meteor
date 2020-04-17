import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import intl from '../../../utils/intl';
import { ACTIVITY_EVENT_METADATA } from '../../activities/activityConstants';
import ActivityService from '../../activities/server/ActivityService';
import BorrowerService from '../../borrowers/server/BorrowerService';
import {
  getNewName,
  setAssignees,
} from '../../helpers/server/collectionServerHelpers';
import CollectionService from '../../helpers/server/CollectionService';
import { INSURANCE_STATUS } from '../../insurances/insuranceConstants';
import InsuranceService from '../../insurances/server/InsuranceService';
import LoanService from '../../loans/server/LoanService';
import { REVENUE_STATUS } from '../../revenues/revenueConstants';
import UserService from '../../users/server/UserService';
import {
  INSURANCE_REQUESTS_COLLECTION,
  INSURANCE_REQUEST_STATUS,
  INSURANCE_REQUEST_STATUS_ORDER,
} from '../insuranceRequestConstants';
import InsuranceRequests from '../insuranceRequests';

const { formatMessage } = intl;

class InsuranceRequestService extends CollectionService {
  constructor() {
    super(InsuranceRequests);
  }

  insert = ({
    insuranceRequest = {},
    userId,
    loanId,
    assignees,
    updateUserAssignee,
    borrowerIds,
  }) => {
    const name = getNewName({
      collection: INSURANCE_REQUESTS_COLLECTION,
      loanId,
    });
    const insuranceRequestId = super.insert({ ...insuranceRequest, name });
    const loan =
      loanId &&
      LoanService.get(loanId, {
        user: { _id: 1 },
        assigneeLinks: { _id: 1, percent: 1, isMain: 1 },
      });
    const user =
      userId && UserService.get(userId, { assignedEmployee: { _id: 1 } });

    if (loan) {
      this.linkLoan({ insuranceRequestId, loanId });
      const { user: { _id: loanUserId } = {} } = loan;
      if (loanUserId) {
        this.addLink({
          id: insuranceRequestId,
          linkName: 'user',
          linkId: loanUserId,
        });
      }
    }

    if (user) {
      this.addLink({
        id: insuranceRequestId,
        linkName: 'user',
        linkId: userId,
      });
    }

    if (borrowerIds?.length) {
      borrowerIds.forEach(borrowerId =>
        this.linkBorrower({ insuranceRequestId, borrowerId }),
      );
    }

    // Set the assignee
    if (assignees) {
      this.setAssignees({
        insuranceRequestId,
        assignees,
        loanId,
        updateUserAssignee,
      });
    }
    // Set the same assignees as the loan
    else if (!user && loan) {
      const { assigneeLinks: loanAssignees = [] } = loan;
      if (loanAssignees?.length) {
        this.setAssignees({
          insuranceRequestId,
          assignees: loanAssignees,
        });
      }
    }
    // Set the same assignee as the user
    else if (user) {
      const { assignedEmployee = {} } = user;
      if (assignedEmployee) {
        this.setAssignees({
          insuranceRequestId,
          assignees: [
            { _id: assignedEmployee._id, percent: 100, isMain: true },
          ],
        });
      }
    }

    return insuranceRequestId;
  };

  setAssignees = ({ insuranceRequestId, ...params }) =>
    setAssignees({
      docId: insuranceRequestId,
      collection: INSURANCE_REQUESTS_COLLECTION,
      ...params,
    });

  setAdminNote({ insuranceRequestId, adminNoteId, note, userId }) {
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

    const { adminNotes: currentAdminNotes = [] } = this.get(
      insuranceRequestId,
      {
        adminNotes: 1,
      },
    );

    const adminNoteExists =
      adminNoteId && currentAdminNotes.find(({ id }) => id === adminNoteId);

    if (adminNoteExists) {
      result = this.baseUpdate(
        { _id: insuranceRequestId, 'adminNotes.id': adminNoteId },
        { $set: { 'adminNotes.$': { ...formattedNote, id: adminNoteId } } },
      );
    } else {
      const { _id: insuranceId } = adminNoteId
        ? InsuranceService.get({ 'adminNotes.id': adminNoteId }, { _id: 1 })
        : {};

      if (insuranceId) {
        InsuranceService.removeAdminNote({
          insuranceId,
          adminNoteId,
        });
      }

      result = this._update({
        id: insuranceRequestId,
        operator: '$push',
        object: { adminNotes: { ...formattedNote, id: Random.id() } },
      });
    }

    // Sort adminNotes by date for faster retrieval of recent notes
    // Most recent is always at the top
    const { adminNotes } = this.get(insuranceRequestId, { adminNotes: 1 });
    this._update({
      id: insuranceRequestId,
      object: {
        adminNotes: adminNotes.sort(
          ({ date: a }, { date: b }) =>
            new Date(b).getTime() - new Date(a).getTime(),
        ),
      },
    });

    this.updateProNote({ insuranceRequestId });

    return result;
  }

  removeAdminNote({ insuranceRequestId, adminNoteId }) {
    const result = this.baseUpdate(insuranceRequestId, {
      $pull: { adminNotes: { id: adminNoteId } },
    });

    this.updateProNote({ insuranceRequestId });

    return result;
  }

  updateProNote({ insuranceRequestId }) {
    const { adminNotes } = this.get(insuranceRequestId, { adminNotes: 1 });
    const proNote = adminNotes.find(note => note.isSharedWithPros);

    if (proNote) {
      return this._update({ id: insuranceRequestId, object: { proNote } });
    }

    return this._update({
      id: insuranceRequestId,
      operator: '$unset',
      object: { proNote: true },
    });
  }

  verifyStatusChange({ insuranceRequestId, status, isServerCall = false }) {
    const { status: prevStatus } = this.get(insuranceRequestId, { status: 1 });

    if (isServerCall) {
      return prevStatus;
    }

    if (prevStatus === status) {
      throw new Meteor.Error("Ce statut est le même qu'avant");
    }

    if (
      [
        INSURANCE_REQUEST_STATUS.BILLING,
        INSURANCE_REQUEST_STATUS.FINALIZED,
      ].includes(status)
    ) {
      throw new Meteor.Error(
        'Ce statut ne peut pas être appliqué manuellement',
      );
    }

    const orderedStatuses = INSURANCE_REQUEST_STATUS_ORDER.filter(
      s =>
        ![
          INSURANCE_REQUEST_STATUS.PENDING,
          INSURANCE_REQUEST_STATUS.UNSUCCESSFUL,
          INSURANCE_REQUEST_STATUS.TEST,
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

  setStatus({ insuranceRequestId, status, isServerCall = false }) {
    const prevStatus = this.verifyStatusChange({
      insuranceRequestId,
      status,
      isServerCall,
    });

    this._update({ id: insuranceRequestId, object: { status } });
    return { prevStatus, nextStatus: status };
  }

  calculateNewStatus({ insuranceRequestId }) {
    const { insurances = [], status: insuranceRequestStatus } = this.get(
      insuranceRequestId,
      {
        insurances: { status: 1, revenues: { status: 1 } },
        status: 1,
      },
    );

    const shouldBeBilling =
      insuranceRequestStatus !== INSURANCE_REQUEST_STATUS.BILLING &&
      insurances
        .filter(({ status }) => status !== INSURANCE_STATUS.DECLINED)
        .every(({ status }) => status === INSURANCE_STATUS.POLICED);

    const insurancesRevenues = insurances.reduce(
      (allRevenues, { revenues = [] }) => [...allRevenues, ...revenues],
      [],
    );

    const shouldBeFinalized =
      insuranceRequestStatus === INSURANCE_REQUEST_STATUS.BILLING &&
      !!insurancesRevenues.length &&
      insurancesRevenues.every(
        ({ status }) => status === REVENUE_STATUS.CLOSED,
      );

    let statusChanged = false;
    let prevStatus;
    let nextStatus;

    if (shouldBeFinalized) {
      const { prevStatus: previous, nextStatus: next } = this.setStatus({
        insuranceRequestId,
        status: INSURANCE_REQUEST_STATUS.FINALIZED,
        isServerCall: true,
      });
      statusChanged = true;
      prevStatus = previous;
      nextStatus = next;
    } else if (shouldBeBilling) {
      const { prevStatus: previous, nextStatus: next } = this.setStatus({
        insuranceRequestId,
        status: INSURANCE_REQUEST_STATUS.BILLING,
        isServerCall: true,
      });
      statusChanged = true;
      prevStatus = previous;
      nextStatus = next;
    }

    if (statusChanged) {
      const formattedPrevStatus = formatMessage({
        id: `Forms.status.${prevStatus}`,
      });
      const formattedNexStatus = formatMessage({
        id: `Forms.status.${nextStatus}`,
      });
      ActivityService.addEventActivity({
        event: ACTIVITY_EVENT_METADATA.INSURANCE_REQUEST_CHANGE_STATUS,
        details: { prevStatus, nextStatus },
        isServerGenerated: true,
        insuranceRequestLink: { _id: insuranceRequestId },
        title: 'Statut modifié',
        description: `${formattedPrevStatus} -> ${formattedNexStatus}`,
      });
    }
  }

  addBorrower({ insuranceRequestId, amount = 1 }) {
    const {
      user: { _id: userId },
    } = this.get(insuranceRequestId, { user: { _id: 1 } });

    return [...Array(amount)].map(i =>
      BorrowerService.insert({ userId, insuranceRequestId }),
    );
  }

  linkBorrower({ insuranceRequestId, borrowerId }) {
    this.addLink({
      id: insuranceRequestId,
      linkName: 'borrowers',
      linkId: borrowerId,
    });
  }

  linkLoan({ insuranceRequestId, loanId }) {
    this.addLink({
      id: insuranceRequestId,
      linkName: 'loan',
      linkId: loanId,
    });
  }

  linkNewLoan({ insuranceRequestId }) {
    const { user, borrowers = [] } = this.get(insuranceRequestId, {
      user: { _id: 1 },
      borrowers: { _id: 1 },
    });
    const loanId = LoanService.insert({
      loan: { borrowerIds: borrowers.map(({ _id }) => _id) },
      userId: user?._id,
      insuranceRequestId,
    });

    this.addLink({ id: insuranceRequestId, linkName: 'loan', linkId: loanId });

    return loanId;
  }

  remove({ insuranceRequestId }) {
    const { insurances = [], revenues = [] } = this.get(insuranceRequestId, {
      insurances: { _id: 1, revenues: { status: 1 } },
      revenues: { status: 1 },
    });

    if (
      insurances
        .reduce(
          (insurancesRevenues, { revenues: insuranceRevenues = [] }) => [
            ...insurancesRevenues,
            ...insuranceRevenues,
          ],
          revenues,
        )
        .filter(({ status }) => status === REVENUE_STATUS.EXPECTED).length
    ) {
      throw new Meteor.Error(
        'Des revenus sont attendus pour ce dossier assurance. Merci de les supprimer manuellement avant de supprimer le dossier',
      );
    }

    insurances.forEach(({ _id: insuranceId }) =>
      InsuranceService.remove({ insuranceId }),
    );

    return super.remove(insuranceRequestId);
  }
}

export default new InsuranceRequestService({});
