import Organizations from '../organizations';
import { ORGANIZATION_QUERIES } from '../organizationConstants';

export default Organizations.createQuery(
  ORGANIZATION_QUERIES.ADMIN_ORGANIZATIONS,
  {
    $filter({ filters, params }) {},
    name: 1,
    type: 1,
    logo: 1,
    $options: { sort: { name: 1 } },
  },
);
