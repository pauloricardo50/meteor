import React from 'react';

import withHider from '../../../containers/withHider';
import T from '../../Translation';

export default withHider({
  label: <T id="AccountPage.DevelopperSection.show" />,
  primary: true,
  style: {
    margin: '16px',
    position: 'absolute',
    right: '0px',
    top: '0px',
  },
});
