import React from 'react';
import { withProps } from 'recompose';

import {
  promotionUpdate,
  updatePromotionTimeline,
} from '../../../../api/promotions/methodDefinitions';
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
    important // You don't want to lose your progress on this form :)
  />
);

export default withProps(({ promotion: { _id: promotionId } }) => ({
  onSubmit: ({ signingDate, constructionTimeline }) =>
    promotionUpdate
      .run({ promotionId, object: { signingDate } })
      .then(() =>
        updatePromotionTimeline.run({ promotionId, constructionTimeline }),
      ),
}))(PromotionTimelineForm);
