// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';

import T from 'core/components/Translation';
import AutoForm from 'core/components/AutoForm2';
import PromotionSchema from 'core/api/promotions/schemas/PromotionSchema';
import { promotionInsert } from 'core/api';
import { createRoute } from 'core/utils/routerUtils';
import { PRO_PROMOTION_PAGE } from 'imports/startup/client/proRoutes';

type NewPromotionPageProps = {};

const NewPromotionPage = ({ history }: NewPromotionPageProps) => (
  <div className="card1 new-promotion-page">
    <h1>
      <T id="NewPromotionPage.title" />
    </h1>
    <AutoForm
      schema={PromotionSchema.pick(
        'name',
        'type',
        'address1',
        'address2',
        'zipCode',
        'city',
      )}
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
  </div>
);

export default withRouter(NewPromotionPage);
