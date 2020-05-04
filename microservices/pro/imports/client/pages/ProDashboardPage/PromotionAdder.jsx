import React from 'react';
import { withRouter } from 'react-router-dom';

import { promotionInsert } from 'core/api/promotions/methodDefinitions';
import { BasePromotionSchema } from 'core/api/promotions/schemas/PromotionSchema';
import { AutoFormDialog } from 'core/components/AutoForm2';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';

import PRO_ROUTES from '../../../startup/client/proRoutes';

const PromotionAdder = ({ history }) => (
  <AutoFormDialog
    title={<T id="ProDashboardPage.addPromotion" />}
    buttonProps={{
      label: <T id="ProDashboardPage.addPromotion" />,
      raised: true,
      primary: true,
      icon: <Icon type="add" />,
    }}
    schema={BasePromotionSchema}
    onSubmit={promotion =>
      promotionInsert
        .run({ promotion })
        .then(promotionId =>
          history.push(
            createRoute(PRO_ROUTES.PRO_PROMOTION_PAGE.path, { promotionId }),
          ),
        )
    }
    autoFieldProps={{
      labels: {
        name: <T id="ProDashboardPage.PromotionAdder.name" />,
        type: <T id="ProDashboardPage.PromotionAdder.type" />,
      },
    }}
  />
);

export default withRouter(PromotionAdder);
