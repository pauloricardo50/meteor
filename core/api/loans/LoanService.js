import { Random } from 'meteor/random';
import moment from 'moment';

import { getAuctionEndTime } from '../../utils/loanFunctions';
import { LOAN_STATUS, AUCTION_STATUS } from '../constants';
import BorrowerService from '../borrowers/BorrowerService';
import PropertyService from '../properties/PropertyService';
import Loans from './loans';

export class LoanService {
  insert = ({ loan, userId }) => Loans.insert({ ...loan, userId });

  update = ({ loanId, object, operator = '$set' }) =>
    Loans.update(loanId, { [operator]: object });

  remove = ({ loanId }) => Loans.remove(loanId);

  getLoanById = loanId => Loans.findOne(loanId);

  adminLoanInsert = ({ userId }) => {
    const borrowerId = BorrowerService.insert({ userId });
    const propertyId = PropertyService.insert({ userId });
    const loanId = this.insert({
      loan: { propertyIds: [propertyId], borrowerIds: [borrowerId] },
      userId,
    });
    this.addStructure({ loanId });
    return loanId;
  };

  // TODO: make sure step is really done
  incrementStep = ({ loanId }) =>
    this.update({ loanId, operator: '$inc', object: { 'logic.step': 1 } });

  askVerification = ({ loanId }) => {
    const loan = this.getLoanById(loanId);

    if (loan.logic.verification.requested) {
      // Don't do anything if this loan is already in requested mode
      return false;
    }

    return this.update({
      loanId,
      object: {
        'logic.verification.requested': true,
        'logic.verification.requestedAt': new Date(),
      },
    });
  };

  startAuction = ({ loanId }) => {
    const loan = this.getLoanById(loanId);

    if (loan.logic.auction.status !== AUCTION_STATUS.NONE) {
      // Don't do anything if this auction has already started or ended
      return false;
    }

    return this.update({
      loanId,
      object: {
        'logic.auction.status': AUCTION_STATUS.STARTED,
        'logic.auction.startTime': moment().toDate(),
        'logic.auction.endTime': getAuctionEndTime(moment()),
      },
    });
  };

  endAuction = ({ loanId }) => {
    const loan = this.getLoanById(loanId);

    // This method is called in the future (through a job),
    // so only call this if the auction is ongoing
    if (!loan || loan.logic.auction.status !== AUCTION_STATUS.STARTED) {
      return false;
    }

    return this.update({
      loanId,
      object: {
        'logic.auction.status': AUCTION_STATUS.ENDED,
        'logic.auction.endTime': new Date(),
      },
    });
  };

  cancelAuction = ({ loanId }) =>
    this.update({
      loanId,
      object: {
        'logic.auction.endTime': undefined,
        'logic.auction.status': '',
        'logic.auction.startTime': undefined,
      },
    });

  confirmClosing = ({ loanId, object }) =>
    this.update({
      loanId,
      object: { status: LOAN_STATUS.DONE, ...object },
    });

  disableUserForms = ({ loanId }) =>
    this.update({ loanId, object: { userFormsEnabled: false } });

  enableUserForms = ({ loanId }) =>
    this.update({ loanId, object: { userFormsEnabled: true } });

  pushValue = ({ loanId, object }) => Loans.update(loanId, { $push: object });

  popValue = ({ loanId, object }) => Loans.update(loanId, { $pop: object });

  pullValue = ({ loanId, object }) => Loans.update(loanId, { $pull: object });

  addStructure = ({ loanId, structure }) => {
    const loan = this.getLoanById(loanId);
    const isFirstStructure = loan.structures.length === 0;

    if (!isFirstStructure && !structure && loan.selectedStructure) {
      return this.duplicateStructure({
        loanId,
        structureId: loan.selectedStructure,
      });
    }

    const newStructureId = Random.id();
    return Loans.update(loanId, {
      $push: {
        structures: {
          ...structure,
          id: newStructureId,
          propertyId:
            loan.propertyIds.length > 0 ? loan.propertyIds[0] : undefined,
        },
      },
      $set: isFirstStructure ? { selectedStructure: newStructureId } : {},
    });
  };

  removeStructure = ({ loanId, structureId }) => {
    const { selectedStructure: currentlySelected } = this.getLoanById(loanId);

    if (currentlySelected !== structureId) {
      const updateObj = {
        $pull: { structures: { id: structureId } },
      };

      return Loans.update(loanId, updateObj, {
        // Edge case fix: https://github.com/meteor/meteor/issues/4342
        getAutoValues: false,
      });
    }

    throw new Meteor.Error("Can't delete selected structure");
  };

  updateStructure = ({ loanId, structureId, structure }) => {
    const currentStructure = this.getLoanById(loanId).structures.find(({ id }) => id === structureId);

    return Loans.update(
      { _id: loanId, 'structures.id': structureId },
      { $set: { 'structures.$': { ...currentStructure, ...structure } } },
    );
  };

  selectStructure = ({ loanId, structureId }) => {
    // Make sure the structure exists
    const structureExists = this.getLoanById(loanId).structures.some(({ id }) => id === structureId);

    if (structureExists) {
      return this.update({
        loanId,
        object: { selectedStructure: structureId },
      });
    }

    throw new Meteor.Error(`Structure with id "${structureId}" does not exist`);
  };

  duplicateStructure = ({ loanId, structureId }) => {
    const currentStructure = this.getLoanById(loanId).structures.find(({ id }) => id === structureId);

    return (
      !!currentStructure
      && this.addStructure({ loanId, structure: currentStructure })
    );
  };

  addPropertyToLoan = ({ loanId, propertyId }) => {
    this.pushValue({ loanId, object: { propertyIds: propertyId } });
  };
}

export default new LoanService({});
