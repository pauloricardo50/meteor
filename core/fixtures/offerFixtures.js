import shuffle from 'lodash/shuffle';

import { adminLoan, adminProperty } from '../api/fragments';
import LenderService from '../api/lenders/server/LenderService';
import LoanService from '../api/loans/server/LoanService';
import { getRandomOffer } from '../api/offers/fakes';
import OfferService from '../api/offers/server/OfferService';
import OrganisationService from '../api/organisations/server/OrganisationService';
import PropertyService from '../api/properties/server/PropertyService';
import { createOrganisations } from './organisationFixtures';

const getOrgIds = () => OrganisationService.fetch({}).map(({ _id }) => _id);

export const createFakeOffer = loanId => {
  const loan = LoanService.get(loanId, { ...adminLoan(), propertyIds: 1 });
  const property =
    loan.propertyIds &&
    loan.propertyIds.length &&
    PropertyService.get(loan.propertyIds[0], adminProperty());

  if (!property) {
    return;
  }

  const offer = getRandomOffer(
    { loan: { ...loan, _id: loan._id }, property },
    true,
  );
  let allOrganisationIds = getOrgIds();

  if (allOrganisationIds.length === 0) {
    createOrganisations();
    allOrganisationIds = getOrgIds();
  }

  const [randomOrganisationId] = shuffle(allOrganisationIds);
  let lenderId;

  const lender = LenderService.get(
    {
      'loanLink._id': loanId,
      'organisationLink._id': randomOrganisationId,
    },
    { _id: 1 },
  );

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
