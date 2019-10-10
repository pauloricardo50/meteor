// @flow
import React from 'react';
import pick from 'lodash/pick';

import { promotionReservationUpdate } from '../../../../../api/methods';
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
    onSubmit={(values) => {
      // Only send changed keys to the server, so that an unchanged status
      // doesn't trigger a refresh on the date
      const changedKeys = Object.keys(values).filter(key => values[key].valueOf() !== model[key].valueOf());

      if (!changedKeys.length) {
        return Promise.resolve();
      }

      return promotionReservationUpdate.run({
        promotionReservationId,
        object: { [id]: pick(values, changedKeys) },
      });
    }}
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
