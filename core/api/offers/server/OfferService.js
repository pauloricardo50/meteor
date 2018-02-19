import { Meteor } from 'meteor/meteor';
import Offers from '../offers';
import { Loans } from '../..';

export default class {
  static update = ({ id, object }) => Offers.update(id, { $set: object });

  static insert = ({ object, userId }) =>
    Offers.insert({
      ...object,
      // Do this to allow userId to be null
      userId: userId || Meteor.userId(),
    });

  static remove = ({ id }) => Offers.remove(id);

  static pushValue = ({ id, object }) => Offers.update(id, { $push: object });

  static popValue = ({ id, object }) => Offers.update(id, { $pop: object });

  static lenderInsert = ({ object, userId }) => {
    const { loanId } = object;

    // Get the user adding an offer
    const user = userId ? Meteor.users.findOne(userId) : Meteor.user();
    const existingOffer = Offers.findOne({
      loanId: object.loanId,
      organization: user && user.profile.organization,
    });

    // Check if an offer has already been made
    if (existingOffer) {
      throw new Meteor.Error(
        'noTwoOffers',
        'Your organization has already made an offer on this loan',
      );
    }

    const loan = Loans.findOne(loanId);

    return this.insert({
      userId,
      object: {
        ...object,
        organization: user && user.profile.organization,
        canton: user && user.profile.cantons[0],
        auctionEndTime: loan.logic.auction.endTime,
      },
    });
  };

  static adminInsert = ({ object }) => {
    const { loanId } = object;
    const loan = Loans.findOne(loanId);

    return Offers.insert({
      ...object,
      userId: Meteor.userId(),
      isAdmin: true,
      auctionEndTime: loan.logic.auction.endTime,
      canton: 'GE',
    });
  };
}
