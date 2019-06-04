// @flow
import React from 'react';

import { BasePromotionSchema } from '../../../../api/promotions/schemas/PromotionSchema';
import { promotionUpdate } from '../../../../api';
import { AutoFormDialog } from '../../../AutoForm2';
import T from '../../../Translation';

type PromotionModifierProps = {};

const PromotionModifier = ({ promotion }: PromotionModifierProps) => (
  <AutoFormDialog
    buttonProps={{ primary: true, label: <T id="general.modify" /> }}
    model={promotion}
    schema={BasePromotionSchema}
    onSubmit={object =>
      promotionUpdate.run({ promotionId: promotion._id, object })
    }
    autoFieldProps={{
      labels: { name: 'Nom de la promotion', type: 'Type de promotion' },
    }}
  />
);

export default PromotionModifier;
