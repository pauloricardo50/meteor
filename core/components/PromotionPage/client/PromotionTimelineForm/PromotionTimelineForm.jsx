import React from 'react';
import omit from 'lodash/omit';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import {
  promotionUpdate,
  updatePromotionTimeline,
} from '../../../../api/promotions/methodDefinitions';
import PromotionSchema, {
  constructionTimelineSchema,
} from '../../../../api/promotions/schemas/PromotionSchema';
import AutoFormDialog from '../../../AutoForm2/AutoFormDialog';

const schema = PromotionSchema.pick('signingDate').extend({
  constructionTimeline: {
    optional: true,
    defaultValue: {},
    type: new SimpleSchema(omit(constructionTimelineSchema, 'steps.$.id')),
  },
});

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
