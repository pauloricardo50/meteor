// @flow
import React from 'react';

import { BasePromotionSchema } from '../../../api/promotions/schemas/PromotionSchema';
import { promotionUpdate } from '../../../api';
import { AutoFormDialog } from '../../AutoForm2';
import T from '../../Translation';
import ClientEventService from '../../../api/events/ClientEventService';
import { PROMOTION_QUERIES } from '../../../api/constants';

type PromotionModifierProps = {};

const PromotionModifier = ({ promotion }: PromotionModifierProps) => (
  <AutoFormDialog
    buttonProps={{ primary: true, label: <T id="general.modify" /> }}
    model={promotion}
    schema={BasePromotionSchema}
    onSubmit={object =>
      promotionUpdate.run({ promotionId: promotion._id, object }).then(() => {
        ClientEventService.emit(PROMOTION_QUERIES.PRO_PROMOTION);
        ClientEventService.emit(PROMOTION_QUERIES.APP_PROMOTION);
      })
    }
    autoFieldProps={{
      labels: { name: 'Nom de la promotion', type: 'Type de promotion' },
    }}
  />
);

export default PromotionModifier;
