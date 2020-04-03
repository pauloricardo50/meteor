import faker from 'faker/locale/fr';
import random from 'lodash/random';

import ContactService from '../api/contacts/server/ContactService';
import {
  ORGANISATION_FEATURES,
  ORGANISATION_TAGS,
  ORGANISATION_TYPES,
} from '../api/organisations/organisationConstants';
import OrganisationService from '../api/organisations/server/OrganisationService';
import { createLenderRules } from './lenderRulesFixtures';

const orgs = [
  {
    name: 'UBS',
    type: ORGANISATION_TYPES.BANK,
    logo: 'https://sos-ch-dk-2.exo.io/fixture-files/ubs-logo.png',
    features: [ORGANISATION_FEATURES.LENDER],
    tags: [ORGANISATION_TAGS.CH_RETAIL],
  },
  {
    name: 'Crédit Suisse',
    type: ORGANISATION_TYPES.BANK,
    logo: 'https://sos-ch-dk-2.exo.io/fixture-files/cs-logo.png',
    features: [ORGANISATION_FEATURES.LENDER],
    tags: [ORGANISATION_TAGS.CH_RETAIL],
  },
  {
    name: 'Allianz',
    type: ORGANISATION_TYPES.INSURANCE,
    logo: 'https://sos-ch-dk-2.exo.io/fixture-files/allianz-logo.png',
    features: [ORGANISATION_FEATURES.LENDER],
    tags: [ORGANISATION_TAGS.CH_RETAIL],
  },
  {
    name: 'Pictet',
    type: ORGANISATION_TYPES.PRIVATE_BANK,
    logo: 'https://sos-ch-dk-2.exo.io/fixture-files/pictet-logo.png',
    features: [ORGANISATION_FEATURES.LENDER],
    tags: [ORGANISATION_TAGS.CH_RETAIL],
  },
];

export const createOrganisations = () =>
  orgs.map(org => {
    const orgId = OrganisationService.insert(org);

    if (org.features.includes(ORGANISATION_FEATURES.LENDER)) {
      createLenderRules(orgId);
    }

    const contactCount = random(1, 3, false);

    for (let index = 0; index < contactCount; index += 1) {
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
          { _id: orgId, metadata: { title: faker.name.jobTitle() } },
        ],
      });
    }
  });
