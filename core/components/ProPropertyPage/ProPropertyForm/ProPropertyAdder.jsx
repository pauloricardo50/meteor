import React from 'react';
import { withProps, compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { propertyInsert } from '../../../api/methods';
import { PROPERTY_CATEGORY } from '../../../api/constants';
import { createRoute } from '../../../utils/routerUtils';
import T from '../../Translation';
import ProPropertyForm from './ProPropertyForm';

export default compose(
  withRouter,
  withProps(({ history }) => ({
    onSubmit: property =>
      propertyInsert
        .run({ property: { ...property, category: PROPERTY_CATEGORY.PRO } })
        .then(propertyId =>
          history.push(createRoute('/properties/:propertyId', { propertyId }))),
    buttonLabel: <T id="ProDashboardPage.addProperty" />,
  })),
)(ProPropertyForm);
