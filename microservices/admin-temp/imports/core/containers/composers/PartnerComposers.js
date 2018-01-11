import { Meteor } from 'meteor/meteor';

import LoanRequests from '../../api/loanrequests/loanrequests';
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

export function partnerRequestsComposer(props, onData) {
  if (Meteor.subscribe('partnerRequestsAuction').ready()) {
    if (Meteor.subscribe('partnerRequestsCompleted').ready()) {
      const loanRequests = LoanRequests.find({}).fetch();

      onData(null, { loanRequests });
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

export function partnerRequestComposer(props, onData) {
  const requestId = props.match.params.requestId;

  if (Meteor.subscribe('partnerSingleLoanRequest', requestId).ready()) {
    const loanRequest = LoanRequests.findOne({}).fetch();

    onData(null, { loanRequest });
  }
}
