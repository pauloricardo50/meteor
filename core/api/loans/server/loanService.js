import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import Loans from './loans';

import { LOAN_STATUS, AUCTION_STATUS } from '../constants';
import { getAuctionEndTime } from '../../utils/loanFunctions';

export default class {
    static update = ({ id, object }) => Loans.update(id, { $set: object });

    static insert = ({ object, userId }) =>
        Loans.insert({
            ...object,
            // Do this to allow userId to be null
            userId: userId === undefined ? Meteor.userId() : userId,
        });

    static remove = ({ id }) => Loans.remove(id);

    static pushValue = ({ id, object }) => Loans.update(id, { $push: object });

    static popValue = ({ id, object }) => Loans.update(id, { $pop: object });

    static askVerification = ({ id }) => {
        const loan = Loans.findOne(id);

        if (loan.logic.verification.requested) {
            // Don't do anything if this loan is already in requested mode
            return false;
        }

        return this.update({
            id,
            object: {
                'logic.verification.requested': true,
                'logic.verification.requestedTime': new Date(),
            },
        });
    };

    static startAuction = ({ id }) => {
        const loan = Loans.findOne(id);

        if (loan.logic.auction.status !== AUCTION_STATUS.NONE) {
            // Don't do anything if this auction has already started or ended
            return false;
        }

        return this.update({
            id,
            object: {
                'logic.auction.status': AUCTION_STATUS.STARTED,
                'logic.auction.startTime': moment().toDate(),
                'logic.auction.endTime': getAuctionEndTime(moment()),
            },
        });
    };

    static endAuction = ({ id }) => {
        const loan = Loans.findOne(id);

        // This method is called in the future (through a job),
        // so make sure that it isn't
        // executed again if this has already been done
        if (!loan || loan.logic.auction.status === AUCTION_STATUS.ENDED) {
            return false;
        }

        return this.update({
            id,
            object: {
                'logic.auction.status': AUCTION_STATUS.ENDED,
                'logic.auction.endTime': new Date(),
            },
        });
    };

    static cancelAuction = ({ id }) =>
        this.update({
            id,
            object: {
                'logic.auction.endTime': undefined,
                'logic.auction.status': '',
                'logic.auction.startTime': undefined,
            },
        });

    static confirmClosing = ({ id, object }) =>
        this.update({
            id,
            object: {
                status: LOAN_STATUS.DONE,
                ...object,
            },
        });
}
