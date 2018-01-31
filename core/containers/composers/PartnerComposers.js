import { Meteor } from 'meteor/meteor';

import Loans from '../../api/loans/loans';
import Offers from '../../api/offers/offers';

export function partnerOffersComposer(props, onData) {
  if (Meteor.subscribe('partnerOffers').ready()) {
    // TODO make sure this works in any time zone
    const currentOffers = Offers.find({
      auctionEndTime: { $gte: new Date() },
    }).fetch();

    // auction end time is less than current time
    const oldOffers = Offers.find({
      auctionEndTime: { $lt: new Date() },
    }).fetch();

    onData(null, { currentOffers, oldOffers });
  }
}

export function partnerLoansComposer(props, onData) {
  if (Meteor.subscribe('partnerLoansAuction').ready()) {
    if (Meteor.subscribe('partnerLoansCompleted').ready()) {
      const loans = Loans.find({}).fetch();

      onData(null, { loans });
    }
  }
}

export function partnerOfferComposer(props, onData) {
  const offerId = props.match.params.offerId;

  if (Meteor.subscribe('offer', offerId).ready()) {
    const offer = Offers.findOne({}).fetch();

    onData(null, { offer });
  }
}

export function partnerLoanComposer(props, onData) {
  const loanId = props.match.params.loanId;

  if (Meteor.subscribe('partnerSingleLoan', loanId).ready()) {
    const loan = Loans.findOne({}).fetch();

    onData(null, { loan });
  }
}
