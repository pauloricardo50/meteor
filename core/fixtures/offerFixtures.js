import OfferService from 'core/api/offers/OfferService';
import { getRandomOffer } from 'core/api/offers/fakes';
import { Loans, Properties } from 'core/api';

export const createFakeOffer = (loanId, userId) => {
  const loan = Loans.findOne(loanId);
  const property = Properties.findOne(loan.propertyIds[0]);
  const offer = getRandomOffer(
    { loan: { ...loan, _id: loan._id }, property },
    true,
  );

  return OfferService.insert({ offer: { ...offer, loanId: loan._id }, userId });
};
