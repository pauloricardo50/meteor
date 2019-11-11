import shuffle from 'lodash/shuffle';

import { getRandomOffer } from '../api/offers/fakes';
import OfferService from '../api/offers/server/OfferService';
import LenderService from '../api/lenders/server/LenderService';
import OrganisationService from '../api/organisations/server/OrganisationService';
import LoanService from '../api/loans/server/LoanService';
import PropertyService from '../api/properties/server/PropertyService';
import { createOrganisations } from './organisationFixtures';

const getOrgIds = () => OrganisationService.fetch({}).map(({ _id }) => _id);

export const createFakeOffer = loanId => {
  const loan = LoanService.findOne(loanId);
  const property = PropertyService.findOne(loan.propertyIds[0]);
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
  let lenderId;

  const lender = LenderService.findOne({
    'loanLink._id': loanId,
    'organisationLink._id': randomOrganisationId,
  });

  if (lender) {
    lenderId = lender._id;
  } else {
    lenderId = LenderService.insert({
      lender: { loanId: loan._id },
      contactId: null,
      organisationId: randomOrganisationId,
    });
  }

  return OfferService.insert({ offer: { ...offer, lenderId } });
};
