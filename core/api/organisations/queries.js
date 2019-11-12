import {
  fullOrganisation,
  userOrganisation,
  adminOrganisation,
} from '../fragments';
import { ORGANISATION_QUERIES } from './organisationConstants';
import Organisations from '.';

export const adminOrganisations = Organisations.createQuery(
  ORGANISATION_QUERIES.ADMIN_ORGANISATIONS,
  adminOrganisation(),
  { scoped: true },
);

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
  fullOrganisation(),
);

export const userOrganisations = Organisations.createQuery(
  ORGANISATION_QUERIES.USER_ORGANISATIONS,
  {
    ...userOrganisation(),
    $options: { sort: { name: 1 } },
  },
);
