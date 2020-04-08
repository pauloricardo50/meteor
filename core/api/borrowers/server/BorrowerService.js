import { Meteor } from 'meteor/meteor';

import { adminBorrower } from '../../fragments';
import CollectionService from '../../helpers/server/CollectionService';
import InsuranceRequestService from '../../insuranceRequests/server/InsuranceRequestService';
import LoanService from '../../loans/server/LoanService';
import UserService from '../../users/server/UserService';
import Borrowers from '../borrowers';

export class BorrowerService extends CollectionService {
  constructor() {
    super(Borrowers);
  }

  update = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $set: object });

  insert = ({ borrower = {}, userId, loanId, insuranceRequestId }) => {
    let borrowerPersonalInfo = {};

    if (loanId) {
      const { borrowers = [] } = LoanService.get(loanId, {
        borrowers: { _id: 1 },
      });
      if (borrowers.length === 0) {
        const { firstName, lastName, phoneNumber, email } =
          UserService.get(userId, {
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            email: 1,
          }) || {};

        borrowerPersonalInfo = {
          firstName,
          lastName,
          phoneNumber,
          email,
        };
      }
    }

    const borrowerId = Borrowers.insert({
      ...borrowerPersonalInfo,
      ...borrower,
      userId,
    });

    if (loanId) {
      this.addLink({ id: borrowerId, linkName: 'loans', linkId: loanId });
    }

    if (insuranceRequestId) {
      this.addLink({
        id: borrowerId,
        linkName: 'insuranceRequests',
        linkId: insuranceRequestId,
      });
    }
    return borrowerId;
  };

  remove = ({ borrowerId, loanId }) => {
    LoanService.cleanupRemovedBorrower({ borrowerId });
    const borrower = this.get(borrowerId, adminBorrower());
    if (borrower.loans && borrower.loans.length > 1) {
      const loansLink = this.getLink(borrowerId, 'loans');
      if (loanId) {
        // Fix this conditional when the issue has been dealt with
        // https://github.com/cult-of-coders/grapher/issues/332
        loansLink.remove(loanId);
      } else {
        // Only admins can remove a borrower that has multiple loans
        return Borrowers.remove(borrowerId);
      }
    } else {
      return Borrowers.remove(borrowerId);
    }
  };

  pushValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $push: object });

  popValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $pop: object });

  pullValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $pull: object });

  getReusableBorrowers({ loanId, insuranceRequestId }) {
    let userId;
    if (loanId) {
      const { user } = LoanService.get(loanId, { user: { _id: 1 } });
      userId = user?._id;
    } else if (insuranceRequestId) {
      const { user } = InsuranceRequestService.get(insuranceRequestId, {
        user: { _id: 1 },
      });
      userId = user?._id;
    }

    if (!userId) {
      throw new Meteor.Error('No userId found');
    }

    const borrowers = this.fetch({
      $filters: { userId },
      name: 1,
      loans: { _id: 1, name: 1 },
      insuranceRequests: { _id: 1, name: 1 },
    });

    const filteredBorrowers = borrowers?.length
      ? borrowers.filter(({ loans = [], insuranceRequests = [] }) => {
          const isInLoan = loanId && loans.some(({ _id }) => _id === loanId);
          const isInInsuranceRequest =
            insuranceRequestId &&
            insuranceRequests.some(({ _id }) => _id === insuranceRequestId);

          return !isInLoan && !isInInsuranceRequest;
        })
      : [];

    return filteredBorrowers;
  }

  cleanUpMortgageNotes({ borrowerId }) {
    const { mortgageNotes = [], loans = [] } = this.get(borrowerId, {
      mortgageNotes: { _id: 1 },
      loans: { structures: 1 },
    });
    const borrowerMortgageNoteIds = mortgageNotes.map(({ _id }) => _id);

    loans.forEach(({ _id: loanId, structures = [] }) => {
      structures.forEach(({ id: structureId, mortgageNoteIds = [] }) => {
        LoanService.updateStructure({
          loanId,
          structureId,
          structure: {
            mortgageNoteIds: mortgageNoteIds.filter(
              id => !borrowerMortgageNoteIds.includes(id),
            ),
          },
        });
      });
    });
  }

  cleanUpBorrowers({ borrowerId }) {
    const { insuranceRequests = [], loans = [] } = this.get(borrowerId, {
      loans: { _id: 1 },
      insuranceRequests: { _id: 1 },
    });
    const hasOneLoan = loans.length === 1;
    const hasOneInsuranceRequest = insuranceRequests.length === 1;

    if (hasOneLoan ? !hasOneInsuranceRequest : hasOneInsuranceRequest) {
      this.remove({ borrowerId });
    }
  }
}

export default new BorrowerService();
