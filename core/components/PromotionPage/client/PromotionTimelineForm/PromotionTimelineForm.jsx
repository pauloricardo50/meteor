import React from 'react';
import { withProps } from 'recompose';

import { promotionUpdate } from '../../../../api/promotions/methodDefinitions';
import PromotionSchema from '../../../../api/promotions/schemas/PromotionSchema';
import AutoFormDialog from '../../../AutoForm2/AutoFormDialog';

const schema = PromotionSchema.pick('signingDate', 'constructionTimeline');

const PromotionTimelineForm = ({ promotion, onSubmit }) => (
  <AutoFormDialog
    title="Répartition du financement"
    model={promotion}
    schema={schema}
    onSubmit={onSubmit}
    buttonProps={{
      label: 'Répartition du financement',
      raised: true,
      primary: true,
    }}
  />
);

export default withProps(({ promotion: { _id: promotionId } }) => ({
  onSubmit: object => promotionUpdate.run({ promotionId, object }),
}))(PromotionTimelineForm);
