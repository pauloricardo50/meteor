// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';

import T from 'core/components/Translation';
import { AutoFormDialog } from 'core/components/AutoForm2';
import { BasePromotionSchema } from 'core/api/promotions/schemas/PromotionSchema';
import { promotionInsert } from 'core/api';
import { createRoute } from 'core/utils/routerUtils';
import { PRO_PROMOTION_PAGE } from 'imports/startup/client/proRoutes';

type PromotionAdderProps = {};

const PromotionAdder = ({ history }: PromotionAdderProps) => (
  <AutoFormDialog
    title={<T id="ProDashboardPage.addPromotion" />}
    buttonProps={{
      label: <T id="ProDashboardPage.addPromotion" />,
      raised: true,
      primary: true,
    }}
    schema={BasePromotionSchema}
    onSubmit={promotion =>
      promotionInsert
        .run({ promotion })
        .then(promotionId =>
          history.push(createRoute(PRO_PROMOTION_PAGE, { promotionId })))
    }
    autoFieldProps={{
      labels: {
        name: 'Nom de la promotion',
        type: 'Type de promotion',
      },
    }}
  />
);

export default withRouter(PromotionAdder);
