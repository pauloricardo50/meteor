import moment from 'moment';
import React, { useState } from 'react';
import SimpleSchema from 'simpl-schema';

import { promotionOptionUploadAgreement } from '../../../../../../api/methods';
import { CUSTOM_AUTOFIELD_TYPES } from '../../../../../AutoForm2/autoFormConstants';
import AutoFormDialog from '../../../../../AutoForm2/AutoFormDialog';
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

const PromotionLotReservationForm = ({
  agreementDuration,
  promotionOption,
  buttonProps,
}) => {
  const [schema] = useState(getSchema(agreementDuration));
  const [today, setToday] = useState(new Date());

  return (
    <AutoFormDialog
      model={{ startDate: today }}
      schema={schema}
      buttonProps={{
        label: <T id="PromotionLotReservation.reserve" />,
        ...buttonProps,
      }}
      onSubmit={values =>
        promotionOptionUploadAgreement.run({
          promotionOptionId: promotionOption._id,
          ...values,
        })
      }
      title="Réserver"
      onOpen={() => setToday(new Date())}
    />
  );
};

export default PromotionLotReservationForm;
