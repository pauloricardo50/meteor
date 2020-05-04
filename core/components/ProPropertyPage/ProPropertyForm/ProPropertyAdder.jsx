import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, mapProps } from 'recompose';

import { proPropertyInsert } from '../../../api/properties/methodDefinitions';
import { createRoute } from '../../../utils/routerUtils';
import Icon from '../../Icon';
import T from '../../Translation';
import ProPropertyForm from './ProPropertyForm';

export default compose(
  withRouter,
  mapProps(({ history, currentUser: { _id: userId } }) => ({
    onSubmit: property =>
      proPropertyInsert
        .run({ userId, property })
        .then(propertyId =>
          history.push(createRoute('/properties/:propertyId', { propertyId })),
        ),
    buttonProps: {
      label: <T id="ProDashboardPage.addProperty" />,
      icon: <Icon type="add" />,
    },
  })),
)(ProPropertyForm);
