// @flow
import React from 'react';

import AutoForm, { CustomAutoField } from '../../AutoForm2';
import { promotionUpdate } from '../../../api';
import PromotionSchema from '../../../api/promotions/schemas/PromotionSchema';
import ClientEventService from '../../../api/events/ClientEventService';
import { PROMOTION_QUERIES } from '../../../api/constants';

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
      }).then(() => ClientEventService.emit(PROMOTION_QUERIES.PRO_PROMOTION))
    }
    className="update-field"
  >
    <CustomAutoField name="status" overrideLabel="Statut de la promotion" />
  </AutoForm>
);

export default PromotionStatusModifier;
