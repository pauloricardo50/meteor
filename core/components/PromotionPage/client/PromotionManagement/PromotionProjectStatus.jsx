// @flow
import React from 'react';

import promotionSchema from 'core/api/promotions/schemas/PromotionSchema';
import { promotionUpdate } from 'core/api/methods/index';
import AutoForm, { CustomAutoField } from '../../../AutoForm2';

type PromotionProjectStatusProps = {};

const schema = promotionSchema.pick('projectStatus');

const PromotionProjectStatus = ({ promotion }: PromotionProjectStatusProps) => (
  <AutoForm
    autosave
    schema={schema}
    model={{
      projectStatus: promotion.projectStatus,
    }}
    onSubmit={values =>
      promotionUpdate.run({ promotionId: promotion._id, object: values })
    }
  >
    <CustomAutoField name="projectStatus" />
  </AutoForm>
);

export default PromotionProjectStatus;
