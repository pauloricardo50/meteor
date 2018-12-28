import shuffle from 'lodash/shuffle';

import OfferService from 'core/api/offers/OfferService';
import { getRandomOffer } from 'core/api/offers/fakes';
import { Loans, Properties, Organisations } from 'core/api';
import LenderService from 'imports/core/api/lenders/LenderService';
import { createOrganisations } from './organisationFixtures';

const getOrgIds = () =>
  Organisations.find({})
    .fetch()
    .map(({ _id }) => _id);

export const createFakeOffer = (loanId) => {
  const loan = Loans.findOne(loanId);
  const property = Properties.findOne(loan.propertyIds[0]);
  const offer = getRandomOffer(
    { loan: { ...loan, _id: loan._id }, property },
    true,
  );
  let allOrganisationIds = getOrgIds();

  if (allOrganisationIds.length === 0) {
    createOrganisations();
    allOrganisationIds = getOrgIds();
  }

  const randomOrganisationId = shuffle(allOrganisationIds)[0];

  const lenderId = LenderService.insert({
    lender: { loanId: loan._id },
    contactId: null,
    organisationId: randomOrganisationId,
  });

  return OfferService.insert({
    offer: { ...offer, lenderId },
  });
};
