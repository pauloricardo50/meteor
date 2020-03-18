import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import CollectionService from '../../helpers/server/CollectionService';
import InsuranceRequests from '../insuranceRequests';
import {
  getNewName,
  setAssignees,
} from '../../helpers/server/collectionServerHelpers';
import UserService from '../../users/server/UserService';
import LoanService from '../../loans/server/LoanService';
import InsuranceService from '../../insurances/server/InsuranceService';
import { INSURANCE_REQUESTS_COLLECTION } from '../insuranceRequestConstants';

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
      if (assignees.length) {
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
}

export default new InsuranceRequestService({});
