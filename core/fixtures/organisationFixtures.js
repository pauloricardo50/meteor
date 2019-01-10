import faker from 'faker/locale/fr';
import random from 'lodash/random';

import OrganisationService from '../api/organisations/server/OrganisationService';
import ContactService from '../api/contacts/server/ContactService';
import { ORGANISATION_TYPES, ORGANISATION_FEATURES } from '../api/constants';

const orgs = [
  {
    name: 'UBS',
    type: ORGANISATION_TYPES.BANK,
    logo: 'https://sos-ch-dk-2.exo.io/fixture-files/ubs-logo.png',
    features: [ORGANISATION_FEATURES.LENDER],
  },
  {
    name: 'Crédit Suisse',
    type: ORGANISATION_TYPES.BANK,
    logo: 'https://sos-ch-dk-2.exo.io/fixture-files/cs-logo.png',
    features: [ORGANISATION_FEATURES.LENDER],
  },
  {
    name: 'Allianz',
    type: ORGANISATION_TYPES.INSURANCE,
    logo: 'https://sos-ch-dk-2.exo.io/fixture-files/allianz-logo.png',
    features: [ORGANISATION_FEATURES.LENDER],
  },
  {
    name: 'Pictet',
    type: ORGANISATION_TYPES.PRIVATE_BANK,
    logo: 'https://sos-ch-dk-2.exo.io/fixture-files/pictet-logo.png',
    features: [ORGANISATION_FEATURES.LENDER],
  },
];

export const createOrganisations = () =>
  orgs.map((org) => {
    const orgId = OrganisationService.insert(org);

    const contactCount = random(1, 3, false);

    for (let index = 0; index < contactCount; index++) {
      const contactId = ContactService.insert({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        address1: faker.address.streetAddress(),
        zipCode: 1201,
        city: 'Genève',
        emails: [{ address: faker.internet.email() }],
        phoneNumbers: [faker.phone.phoneNumber()],
      });

      ContactService.changeOrganisations({
        contactId,
        newOrganisations: [
          { _id: orgId, metadata: { role: faker.name.jobTitle() } },
        ],
      });
    }
  });
