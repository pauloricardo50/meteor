// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import moment from 'moment';
import cx from 'classnames';

import { promotionReservationUpdate } from 'core/api/methods';
import { PromotionReservationSchema } from 'core/api/promotionReservations/promotionReservations';
import { AutoFormDialog } from 'core/components/AutoForm2';
import { PROMOTION_RESERVATION_STATUS } from '../../../../api/promotionReservations/promotionReservationConstants';
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

  if (status === PROMOTION_RESERVATION_STATUS.ACTIVE) {
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
                schema={PromotionReservationSchema.pick(
                  'startDate',
                  'expirationDate',
                )}
                model={{ startDate, expirationDate }}
                triggerComponent={handleOpen => (
                  <IconButton onClick={() => handleOpen(true)} type="edit" />
                )}
                onSubmit={object =>
                  promotionReservationUpdate.run({
                    promotionReservationId,
                    object,
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

  if (status === PROMOTION_RESERVATION_STATUS.WAITLIST) {
    return (
      <div>
        <h1>
          <T id="PromotionReservationDeadline.waitlist" />
        </h1>
        <T id="PromotionReservationDeadline.waitlist.description" />
      </div>
    );
  }

  if (status === PROMOTION_RESERVATION_STATUS.EXPIRED) {
    return (
      <div>
        <h1>
          <T id="PromotionReservationDeadline.expired" />
        </h1>
        <T id="PromotionReservationDeadline.expired.description" />
      </div>
    );
  }

  if (status === PROMOTION_RESERVATION_STATUS.CANCELED) {
    return (
      <div>
        <h1>
          <T id="PromotionReservationDeadline.canceled" />
        </h1>
      </div>
    );
  }

  if (status === PROMOTION_RESERVATION_STATUS.COMPLETED) {
    return (
      <div>
        <h1>
          <T id="PromotionReservationDeadline.completed" />
        </h1>
        <T id="PromotionReservationDeadline.completed.description" />
      </div>
    );
  }
};

export default PromotionReservationDeadline;
