import { compose, withProps } from 'recompose';

import { organisationInsert } from 'core/api';

export default compose(withProps({
  insertOrganization: organisation =>
    organisationInsert.run({ organisation }),
}));
