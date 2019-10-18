// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import { shouldAnonymize } from 'core/api/promotions/promotionClientHelpers';
import { PROMOTION_OPTION_STATUS } from 'core/api/constants';
import T from '../../../../../Translation';
import DialogSimple from '../../../../../DialogSimple';
import { getPromotionCustomerOwnerType } from '../../../../../../api/promotions/promotionClientHelpers';
import { bookPromotionLot } from '../../../../../../api/methods';
import PromotionReservationDetail from '../../../PromotionReservations/PromotionReservationDetail/PromotionReservationDetail';

type PromotionLotReservationProps = {};

const isAdmin = Meteor.microservice === 'admin';

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
  const { reservation, status, promotionLots } = promotionOption;
  const { users = [] } = promotion;
  const { $metadata: { permissions } = {} } = users.find(({ _id }) => _id === currentUser._id) || {};
  const [promotionLot] = promotionLots;
  const {
    $metadata: { invitedBy },
    users: promotionUsers = [],
  } = promotion;

  const customerOwnerType = getPromotionCustomerOwnerType({
    invitedBy,
    currentUser,
  });
  const { status: promotionLotStatus } = promotionLot;
  const anonymize = isAdmin
    ? false
    : shouldAnonymize({
      customerOwnerType,
      permissions,
      promotionLotStatus,
    });

  if (anonymize) {
    return null;
  }

  if (status === PROMOTION_OPTION_STATUS.INTERESTED) {
    return (
      <AutoFormDialog
        model={{ startDate: new Date() }}
        schema={getSchema(promotion)}
        buttonProps={{ label: <T id="PromotionLotReservation.book" /> }}
        onSubmit={values =>
          bookPromotionLot.run({
            promotionOptionId: promotionOption._id,
            ...values,
          })
        }
        title="Réserver"
      />
    );
  }

  return (
    <DialogSimple
      buttonProps={{
        label: 'Réservation existante',
        primary: true,
        raised: false,
      }}
      title={(
        <T
          id="PromotionReservationsTable.modalTitle"
          values={{
            lotName: <b>{promotionLot.name}</b>,
            customerName: <b>{loan.user.name}</b>,
          }}
        />
      )}
      closeOnly
    >
      <PromotionReservationDetail
        promotionOption={promotionOption}
        anonymize={anonymize}
      />
    </DialogSimple>
  );
};

export default PromotionLotReservation;
