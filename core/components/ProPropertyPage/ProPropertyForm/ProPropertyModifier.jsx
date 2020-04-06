import React from 'react';
import { mapProps } from 'recompose';

import { propertyUpdate } from '../../../api/properties/methodDefinitions';
import T from '../../Translation';
import ProPropertyForm from './ProPropertyForm';

export default mapProps(({ property }) => ({
  onSubmit: object => propertyUpdate.run({ propertyId: property._id, object }),
  buttonProps: { label: <T id="general.modify" /> },
  model: property,
}))(ProPropertyForm);
