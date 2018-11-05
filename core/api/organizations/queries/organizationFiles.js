import Organizations from '..';
import { ORGANIZATION_QUERIES } from '../organizationConstants';

export default Organizations.createQuery(ORGANIZATION_QUERIES.FILES, {
  $filter: ({ filters, params: { organizationId } }) => {
    console.log('organizationId', organizationId);
    filters._id = organizationId;
  },
  documents: 1,
});
