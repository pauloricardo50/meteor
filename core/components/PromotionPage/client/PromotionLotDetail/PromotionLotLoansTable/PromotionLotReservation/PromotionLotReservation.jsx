// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import T from '../../../../../Translation';
import { getPromotionCustomerOwnerType } from '../../../../../../api/promotions/promotionClientHelpers';
import { bookPromotionLot } from '../../../../../../api/methods';

type PromotionLotReservationProps = {};

const getSchema = ({ agreementDuration = 0 }) =>
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

const PromotionLotReservation = ({
  loan,
  promotion,
  promotionOption,
  currentUser,
}: PromotionLotReservationProps) => {
  const { promotionReservation } = promotionOption;

  if (!promotionReservation) {
    return (
      <AutoFormDialog
        schema={getSchema(promotion)}
        buttonProps={{ label: <T id="PromotionLotReservation.book" /> }}
        onSubmit={values =>
          bookPromotionLot.run({
            promotionOptionId: promotionOption._id,
            promotionReservation: values,
          })
        }
        title="Réserver"
      />
    );
  }

  const {
    $metadata: { invitedBy },
    users: promotionUsers = [],
  } = promotion;

  const customerOwnerType = getPromotionCustomerOwnerType({
    invitedBy,
    currentUser,
  });

  return <div>Hello from PromotionLotReservation</div>;
};

export default PromotionLotReservation;
