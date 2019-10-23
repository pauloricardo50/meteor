// @flow
import React, { useState } from 'react';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

import { bookPromotionLot } from '../../../../../../api/methods';
import AutoFormDialog from '../../../../../AutoForm2/AutoFormDialog';
import { CUSTOM_AUTOFIELD_TYPES } from '../../../../../AutoForm2/constants';
import T from '../../../../../Translation';

const getSchema = (agreementDuration = 0) =>
  new SimpleSchema({
    startDate: { type: Date, uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE } },
    expirationDate: {
      type: String,
      optional: true,
      uniforms: { type: CUSTOM_AUTOFIELD_TYPES.HTML_PREVIEW },
      customAutoValue: ({ startDate }) => (
        <div>
          {startDate && (
            <p>
              Expire le:&nbsp;
              <b>
                {moment(startDate)
                  .add(agreementDuration, 'd')
                  .format('DD MMMM YYYY')}
              </b>
            </p>
          )}
        </div>
      ),
    },
    agreementFileKeys: {
      type: Array,
      uniforms: { type: CUSTOM_AUTOFIELD_TYPES.FILE_UPLOAD },
      defaultValue: [],
    },
    'agreementFileKeys.$': String,
  });

type PromotionLotReservationFormProps = {};

const PromotionLotReservationForm = ({
  agreementDuration,
  promotionOption,
  buttonProps,
}: PromotionLotReservationFormProps) => {
  const [schema] = useState(getSchema(agreementDuration));
  const [today] = useState(new Date());
  return (
    <AutoFormDialog
      model={{ startDate: today }}
      schema={schema}
      buttonProps={{
        label: <T id="PromotionLotReservation.book" />,
        ...buttonProps,
      }}
      onSubmit={values =>
        bookPromotionLot.run({
          promotionOptionId: promotionOption._id,
          ...values,
        })
      }
      title="Réserver"
    />
  );
};

export default PromotionLotReservationForm;
