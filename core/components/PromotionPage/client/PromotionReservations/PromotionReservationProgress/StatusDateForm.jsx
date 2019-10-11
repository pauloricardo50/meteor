// @flow
import React from 'react';

import { promotionReservationUpdateObject } from '../../../../../api/methods';
import AutoForm from '../../../../AutoForm2';
import { PromotionReservationSchema } from '../../../../../api/promotionReservations/promotionReservations';

type StatusDateFormProps = {};

const StatusDateForm = ({
  model,
  id,
  promotionReservationId,
}: StatusDateFormProps) => (
  <AutoForm
    autosave
    autosaveDelay={300}
    schema={PromotionReservationSchema.getObjectSchema(id)}
    model={model}
    onSubmit={values =>
      promotionReservationUpdateObject.run({
        promotionReservationId,
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

export default StatusDateForm;
