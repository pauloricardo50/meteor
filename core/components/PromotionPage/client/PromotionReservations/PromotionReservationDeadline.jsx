// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import moment from 'moment';
import cx from 'classnames';

import { promotionOptionUpdate } from 'core/api/methods';
import PromotionOptionSchema from 'core/api/promotionOptions/schemas/PromotionOptionSchema';
import { AutoFormDialog } from 'core/components/AutoForm2';
import { PROMOTION_OPTION_STATUS } from '../../../../api/promotionOptions/promotionOptionConstants';
import Tooltip from '../../../Material/Tooltip';
import T from '../../../Translation';
import IconButton from '../../../IconButton';

type PromotionReservationDeadlineProps = {};

const PromotionReservationDeadline = ({
  startDate,
  expirationDate,
  status,
  promotionReservationId,
}: PromotionReservationDeadlineProps) => {
  const inThreeDays = moment().add(3, 'd');
  const momentDate = moment(expirationDate);
  const isTight = inThreeDays.isAfter(momentDate);
  const isAdmin = Meteor.microservice === 'admin';

  if (status === PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE) {
    return (
      <label htmlFor="expirationDate">
        <T id="Forms.expirationDate" />
        <Tooltip
          title={(
            <span>
              {moment(startDate).format('D MMMM YYYY')}
              &nbsp;-&nbsp;
              {momentDate.format('D MMMM YYYY')}
            </span>
          )}
        >
          <h1 className={cx({ 'error-box': isTight })}>
            {momentDate.fromNow()}
            {isAdmin && (
              <AutoFormDialog
                schema={PromotionOptionSchema.getObjectSchema('reservationAgreement').pick('startDate', 'expirationDate')}
                model={{ startDate, expirationDate }}
                triggerComponent={handleOpen => (
                  <IconButton onClick={() => handleOpen(true)} type="edit" />
                )}
                onSubmit={object =>
                  promotionOptionUpdate.run({
                    promotionReservationId,
                    object: {
                      'reservationAgreement.startDate': object.startDate,
                      'reservationAgreement.expirationDate':
                        object.expirationDate,
                    },
                  })
                }
                title="Changer les dates"
              />
            )}
          </h1>
        </Tooltip>
      </label>
    );
  }

  if (status === PROMOTION_OPTION_STATUS.RESERVATION_WAITLIST) {
    return (
      <div>
        <h1>
          <T id="PromotionReservationDeadline.waitlist" />
        </h1>
        <T id="PromotionReservationDeadline.waitlist.description" />
      </div>
    );
  }

  if (status === PROMOTION_OPTION_STATUS.RESERVATION_EXPIRED) {
    return (
      <div>
        <h1>
          <T id="PromotionReservationDeadline.expired" />
        </h1>
        <T id="PromotionReservationDeadline.expired.description" />
      </div>
    );
  }

  if (status === PROMOTION_OPTION_STATUS.RESERVATION_CANCELED) {
    return (
      <div>
        <h1>
          <T id="PromotionReservationDeadline.canceled" />
        </h1>
      </div>
    );
  }

  if (status === PROMOTION_OPTION_STATUS.RESERVED) {
    return (
      <div>
        <h1>
          <T id="PromotionReservationDeadline.reserved" />
        </h1>
        <T id="PromotionReservationDeadline.reserved.description" />
      </div>
    );
  }

  if (status === PROMOTION_OPTION_STATUS.SOLD) {
    return (
      <div>
        <h1>
          <T id="PromotionReservationDeadline.sold" />
        </h1>
        <T id="PromotionReservationDeadline.sold.description" />
      </div>
    );
  }
};

export default PromotionReservationDeadline;
