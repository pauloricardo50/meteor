// @flow
import React from 'react';
import pick from 'lodash/pick';

import AutoForm, { CustomAutoField } from '../../AutoForm2';
import { promotionUpdate } from '../../../api';
import PromotionSchema from '../../../api/promotions/schemas/PromotionSchema';

type PromotionStatusModifierProps = {
  promotion: Object,
};

const PromotionStatusModifier = ({
  promotion,
}: PromotionStatusModifierProps) => (
  <AutoForm
    autosave
    schema={PromotionSchema.pick('status')}
    model={promotion}
    onSubmit={({ status }) =>
      promotionUpdate.run({
        promotionId: promotion._id,
        object: { status },
      })
    }
    className="update-field"
  >
    <CustomAutoField name="status" />
  </AutoForm>
);

export default PromotionStatusModifier;
