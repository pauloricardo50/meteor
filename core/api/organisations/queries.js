import { proOrganisation as proOrganisationFragment } from '../fragments';
import { ORGANISATION_QUERIES } from './organisationConstants';
import Organisations from '.';

export const organisationSearch = Organisations.createQuery(
  ORGANISATION_QUERIES.ORGANISATION_SEARCH,
  {
    name: 1,
    type: 1,
    $options: { sort: { name: 1 }, limit: 5 },
  },
);

export const proOrganisation = Organisations.createQuery(
  ORGANISATION_QUERIES.PRO_ORGANISATION,
  proOrganisationFragment(),
);
