import Organisations from '../organisations';
import { ORGANISATION_QUERIES } from '../organisationConstants';
import { fullOrganisation } from '../../fragments';

export default Organisations.createQuery(
  ORGANISATION_QUERIES.PRO_ORGANISATION,
  {
    ...fullOrganisation(),
  },
);
