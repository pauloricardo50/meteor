import React from 'react';
import { mapProps, compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { proPropertyInsert } from '../../../api/methods';
import { PROPERTY_CATEGORY } from '../../../api/constants';
import { createRoute } from '../../../utils/routerUtils';
import T from '../../Translation';
import ProPropertyForm from './ProPropertyForm';

export default compose(
  withRouter,
  mapProps(({ history, currentUser: { _id: userId } }) => ({
    onSubmit: property =>
      proPropertyInsert
        .run({
          userId,
          property: { ...property, category: PROPERTY_CATEGORY.PRO },
        })
        .then(propertyId =>
          history.push(createRoute('/properties/:propertyId', { propertyId }))),
    buttonLabel: <T id="ProDashboardPage.addProperty" />,
  })),
)(ProPropertyForm);
