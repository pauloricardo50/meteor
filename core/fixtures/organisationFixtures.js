import OrganisationService from '../api/organisations/OrganisationService';
import { ORGANISATION_TYPES } from '../api/constants';

const orgs = [
  {
    name: 'UBS',
    type: ORGANISATION_TYPES.BANK,
    logo: 'https://sos-ch-dk-2.exo.io/fixture-files/ubs-logo.png',
  },
  {
    name: 'Crédit Suisse',
    type: ORGANISATION_TYPES.BANK,
    logo: 'https://sos-ch-dk-2.exo.io/fixture-files/cs-logo.png',
  },
  {
    name: 'Allianz',
    type: ORGANISATION_TYPES.INSURANCE,
    logo: 'https://sos-ch-dk-2.exo.io/fixture-files/allianz-logo.png',
  },
  {
    name: 'Pictet',
    type: ORGANISATION_TYPES.PRIVATE_BANK,
    logo: 'https://sos-ch-dk-2.exo.io/fixture-files/pictet-logo.png',
  },
];

export const createOrganisations = () =>
  orgs.map(org => OrganisationService.insert(org));
