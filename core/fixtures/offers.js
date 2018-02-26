import OfferService from 'core/api/Offers/Offerservice';
import { getRandomOffer } from 'core/api/offers/fakes';
import { fakeProperty } from 'core/api/properties/fakes';

export default (loan) => {
  const object = getRandomOffer(
    { loan: { ...loan, _id: loan._id }, property: fakeProperty },
    true,
  );

  return OfferService.insertAdminOffer({
    object,
  });
};
