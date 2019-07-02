import moment from 'moment';

import CollectionService from '../../helpers/CollectionService';
import LoanService from '../../loans/server/LoanService';
import LenderService from '../../lenders/server/LenderService';
import { LENDER_STATUS } from '../../lenders/lenderConstants';
import { fullOffer } from '../../fragments';
import { EMAIL_IDS } from '../../email/emailConstants';
import { sendEmailToAddress } from '../../methods';
import Offers from '../offers';

export class OfferService extends CollectionService {
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

    const {
      createdAt,
      lender: {
        organisation: { name: organisationName },
        contact: { email: address, name },
        loan: {
          name: loanName,
          user: { assignedEmployee },
        },
      },
    } = this.fetchOne({ $filters: { _id: offerId }, ...fullOffer() });

    const { email: assigneeAddress, name: assigneeName } = assignedEmployee || {};

    return sendEmailToAddress.run({
      emailId: EMAIL_IDS.SEND_FEEDBACK_TO_LENDER,
      address,
      name,
      params: {
        assigneeAddress,
        assigneeName,
        loanName,
        organisationName,
        date: moment(createdAt).format('DD.MM.YYYY'),
        feedback,
      },
    });
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
  };
}

export default new OfferService();
