import React from 'react';

import withHider from '../../../containers/withHider';
import T from '../../Translation';

export default withHider({
  label: <T defaultMessage="Zone développeur" />,
  primary: true,
  style: { marginTop: 16 },
});
