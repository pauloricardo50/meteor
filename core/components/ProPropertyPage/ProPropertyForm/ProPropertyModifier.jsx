import React from 'react';
import { withProps } from 'recompose';

import { propertyUpdate } from '../../../api/methods';
import T from '../../Translation';
import ProPropertyForm from './ProPropertyForm';

export default withProps(({ property }) => ({
  onSubmit: object => propertyUpdate.run({ propertyId: property._id, object }),
  buttonLabel: <T id="general.modify" />,
}))(ProPropertyForm);
