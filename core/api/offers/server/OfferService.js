import moment from 'moment';

import CollectionService from '../../helpers/CollectionService';
import Offers from '../offers';
import LenderService from '../../lenders/server/LenderService';
import { LENDER_STATUS } from '../../lenders/lenderConstants';
import { fullOffer } from '../../fragments';
import { EMAIL_IDS } from '../../email/emailConstants';
import { sendEmailToAddress } from '../../methods';

export class OfferService extends CollectionService {
  constructor() {
    super(Offers);
  }

  update = ({ offerId, object }) => Offers.update(offerId, { $set: object });

  sendFeedback = ({ offerId, feedback }) => {
    this.update({
      offerId,
      object: { feedback: { message: feedback, date: new Date() } },
    });
    const {
      lender: {
        createdAt,
        organisation: { name: organisationName },
        contact: { email: address },
        loan: {
          name: loanName,
          user: {
            assignedEmployee: { email: assigneeAddress, name: assigneeName },
          },
        },
      },
    } = this.fetchOne({
      $filters: { _id: offerId },
      ...fullOffer(),
    });

    return sendEmailToAddress.run({
      emailId: EMAIL_IDS.SEND_FEEDBACK_TO_LENDER,
      address,
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
}

export default new OfferService();
