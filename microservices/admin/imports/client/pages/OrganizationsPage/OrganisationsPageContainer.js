import { compose, withProps } from 'recompose';

import { organizationInsert } from 'core/api';
import { withSmartQuery } from 'core/api/containerToolkit/index';
import adminOrganizations from 'core/api/organizations/queries/adminOrganizations';

export default compose(
  withProps({
    insertOrganization: organization =>
      organizationInsert.run({ organization }),
  }),
  withSmartQuery({
    query: adminOrganizations,
    dataName: 'organizations',
  }),
);
