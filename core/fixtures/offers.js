import OfferService from 'core/api/offers/OfferService';
import { getRandomOffer } from 'core/api/offers/fakes';
import { Loans, Properties } from 'core/api';

const createFakeOffers = (loanId) => {
  const loan = Loans.findOne(loanId);
  const property = Properties.findOne(loan.propertyId);
  const object = getRandomOffer(
    { loan: { ...loan, _id: loan._id }, property },
    true,
  );

  return OfferService.insertAdminOffer({
    offer: object,
    loan,
  });
};

export default createFakeOffers;
