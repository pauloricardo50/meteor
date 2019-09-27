// @flow
import React from 'react';

import promotionSchema from 'core/api/promotions/schemas/PromotionSchema';
import { promotionUpdate } from 'core/api/methods/index';
import AutoForm, { CustomAutoField } from '../../../AutoForm2';

type PromotionAuthorizationStatusProps = {};

const schema = promotionSchema.pick('authorizationStatus');

const PromotionAuthorizationStatus = ({
  promotion,
}: PromotionAuthorizationStatusProps) => (
  <AutoForm
    autosave
    schema={schema}
    model={{
      authorizationStatus: promotion.authorizationStatus,
    }}
    onSubmit={values =>
      promotionUpdate.run({ promotionId: promotion._id, object: values })
    }
  >
    <CustomAutoField name="authorizationStatus" />
  </AutoForm>
);

export default PromotionAuthorizationStatus;
