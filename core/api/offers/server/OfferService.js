import CollectionService from '../../helpers/CollectionService';
import LoanService from '../../loans/server/LoanService';
import LenderService from '../../lenders/server/LenderService';
import { LENDER_STATUS } from '../../lenders/lenderConstants';
import Offers from '../offers';

class OfferService extends CollectionService {
  constructor() {
    super(Offers);
  }

  update = ({ offerId, object }) => Offers.update(offerId, { $set: object });

  sendFeedback = ({ offerId, feedback, saveFeedback = true }) => {
    if (saveFeedback) {
      this.update({
        offerId,
        object: { feedback: { message: feedback, date: new Date() } },
      });
    }
  };

  insert = ({ offer: { lenderId, ...offer } }) => {
    const offerId = Offers.insert({ ...offer });
    this.addLink({ id: offerId, linkName: 'lender', linkId: lenderId });
    LenderService._update({
      id: lenderId,
      object: { status: LENDER_STATUS.OFFER_RECEIVED },
    });
    return offerId;
  };

  remove = ({ offerId }) => Offers.remove(offerId);

  cleanUpOffer = ({ offerId }) => {
    const loan = LoanService.fetchOne({
      $filters: {
        structures: { $elemMatch: { offerId } },
      },
    });

    if (loan) {
      LoanService.update({
        loanId: loan._id,
        object: {
          structures: loan.structures.map(structure => ({
            ...structure,
            offerId:
              structure.offerId === offerId ? undefined : structure.offerId,
          })),
        },
      });
    }
  };
}

export default new OfferService();
