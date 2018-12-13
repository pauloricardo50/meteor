import Organisations from '..';
import { ORGANISATION_QUERIES } from '../organisationConstants';

export default Organisations.createQuery(ORGANISATION_QUERIES.FILES, {
  $filter: ({ filters, params: { organisationId } }) => {
    filters._id = organisationId;
  },
  documents: 1,
});
