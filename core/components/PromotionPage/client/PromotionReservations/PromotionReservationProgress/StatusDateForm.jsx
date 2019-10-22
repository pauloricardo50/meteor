// @flow
import React from 'react';

import { promotionOptionUpdateObject } from '../../../../../api/methods';
import AutoForm from '../../../../AutoForm2';
import PromotionOptionSchema from '../../../../../api/promotionOptions/schemas/PromotionOptionSchema';

type StatusDateFormProps = {};

const StatusDateForm = ({
  model,
  id,
  promotionOptionId,
}: StatusDateFormProps) => {
  const isTextField = id === 'adminNote';
  return (
    <AutoForm
      autosave
      autosaveDelay={isTextField ? 600 : 0}
      schema={PromotionOptionSchema.getObjectSchema(id).pick(
        'date',
        'status',
        'note',
      )}
      model={model}
      onSubmit={values =>
        promotionOptionUpdateObject.run({
          promotionOptionId,
          id,
          object: values,
        })
      }
      className="status-date-form"
      fullWidth={false}
      layout={[
        {
          className: 'grid-col',
          style: { gridTemplateColumns: '1fr 220px' },
          fields: ['__REST'],
        },
      ]}
      submitFieldProps={{ showSubmitField: false }}
    />
  );
};

export default StatusDateForm;
