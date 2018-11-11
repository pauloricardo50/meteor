import shuffle from 'lodash/shuffle';

import OfferService from 'core/api/offers/OfferService';
import { getRandomOffer } from 'core/api/offers/fakes';
import { Loans, Properties, Organisations } from 'core/api';

export const createFakeOffer = (loanId, userId) => {
  const loan = Loans.findOne(loanId);
  const property = Properties.findOne(loan.propertyIds[0]);
  const offer = getRandomOffer(
    { loan: { ...loan, _id: loan._id }, property },
    true,
  );
  const allOrganisationIds = Organisations.find({})
    .fetch()
    .map(({ _id }) => _id);
  const randomOrganisationId = shuffle(allOrganisationIds)[0];

  return OfferService.insert({
    offer: {
      ...offer,
      organisationLink: { _id: randomOrganisationId },
      loanId: loan._id,
    },
    userId,
  });
};
