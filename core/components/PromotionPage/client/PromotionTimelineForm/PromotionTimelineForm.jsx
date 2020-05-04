import React from 'react';
import moment from 'moment';
import { withProps } from 'recompose';

import { promotionUpdate } from '../../../../api/promotions/methodDefinitions';
import PromotionSchema from '../../../../api/promotions/schemas/PromotionSchema';
import { CUSTOM_AUTOFIELD_TYPES } from '../../../AutoForm2/autoFormConstants';
import AutoFormDialog from '../../../AutoForm2/AutoFormDialog';
import PromotionTimelinePicker from './PromotionTimelinePicker';

const schema = PromotionSchema.pick(
  'signingDate',
  'constructionTimeline',
).extend({
  final: {
    type: String,
    optional: true,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.HTML_PREVIEW },
    customAutoValue: ({ signingDate, constructionTimeline }) => (
      <div className="flex-col">
        <label>Fin de la construction</label>
        <h4>
          {signingDate && constructionTimeline.length > 0
            ? moment(signingDate)
                .add(
                  constructionTimeline.reduce(
                    (tot, { duration }) => tot + duration,
                    0,
                  ),
                  'M',
                )
                .format('MMMM YYYY')
            : '-'}
        </h4>
      </div>
    ),
  },
});

const PromotionTimelineForm = ({ promotion, onSubmit }) => (
  <AutoFormDialog
    title="Répartition du financement"
    model={promotion}
    schema={schema}
    onSubmit={onSubmit}
    triggerComponent={handleOpen => (
      <PromotionTimelinePicker
        handleOpen={handleOpen}
        hasTimeline={
          promotion.constructionTimeline &&
          promotion.constructionTimeline.length > 0
        }
        promotionId={promotion._id}
      />
    )}
  />
);

export default withProps(({ promotion: { _id: promotionId } }) => ({
  onSubmit: object => promotionUpdate.run({ promotionId, object }),
}))(PromotionTimelineForm);
