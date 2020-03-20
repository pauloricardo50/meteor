import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import { INSURANCE_STATUS } from 'core/api/insurances/insuranceConstants';
import { REVENUE_STATUS } from 'core/api/revenues/revenueConstants';
import CollectionService from '../../helpers/server/CollectionService';
import InsuranceRequests from '../insuranceRequests';
import {
  getNewName,
  setAssignees,
} from '../../helpers/server/collectionServerHelpers';
import UserService from '../../users/server/UserService';
import LoanService from '../../loans/server/LoanService';
import InsuranceService from '../../insurances/server/InsuranceService';
import BorrowerService from '../../borrowers/server/BorrowerService';
import {
  INSURANCE_REQUESTS_COLLECTION,
  INSURANCE_REQUEST_STATUS,
  INSURANCE_REQUEST_STATUS_ORDER,
} from '../insuranceRequestConstants';

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
        assignees: { percent: 1, isMain: 1 },
      });
    const user =
      userId && UserService.get(userId, { assignedEmployee: { _id: 1 } });

    if (loan) {
      LoanService.addLink({
        id: loanId,
        linkName: 'insuranceRequests',
        linkId: insuranceRequestId,
      });
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
        this.addLink({
          id: insuranceRequestId,
          linkName: 'borrowers',
          linkId: borrowerId,
        }),
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
      const { assignees: loanAssignees = [] } = loan;
      if (assignees?.length) {
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

    return { _id: insuranceRequestId, name };
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
          ({ date: a }, { date: b }) => new Date(b) - new Date(a),
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

  verifyStatusChange({ insuranceRequestId, status }) {
    const { status: prevStatus } = this.get(insuranceRequestId, { status: 1 });

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

  setStatus({ insuranceRequestId, status }) {
    const prevStatus = this.verifyStatusChange({ insuranceRequestId, status });

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

    const shouldBeBilling = insurances
      .filter(({ status }) => status !== INSURANCE_STATUS.DECLINED)
      .every(({ status }) => status === INSURANCE_STATUS.ACTIVE);

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

    if (shouldBeFinalized) {
      this._update({
        id: insuranceRequestId,
        object: { status: INSURANCE_REQUEST_STATUS.FINALIZED },
      });
    } else if (shouldBeBilling) {
      this._update({
        id: insuranceRequestId,
        object: { status: INSURANCE_REQUEST_STATUS.BILLING },
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
}

export default new InsuranceRequestService({});
