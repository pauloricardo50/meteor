// @flow
import React from 'react';

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
    <CustomAutoField name="status" label="Statut de la promotion" />
  </AutoForm>
);

export default PromotionStatusModifier;
