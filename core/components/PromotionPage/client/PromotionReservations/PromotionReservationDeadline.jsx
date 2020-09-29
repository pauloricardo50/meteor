import { Meteor } from 'meteor/meteor';

import React from 'react';
import cx from 'classnames';
import moment from 'moment';

import { promotionOptionUpdate } from '../../../../api/promotionOptions/methodDefinitions';
import {
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_STATUS,
} from '../../../../api/promotionOptions/promotionOptionConstants';
import PromotionOptionSchema from '../../../../api/promotionOptions/schemas/PromotionOptionSchema';
import { AutoFormDialog } from '../../../AutoForm2';
import IconButton from '../../../IconButton';
import Tooltip from '../../../Material/Tooltip';
import T from '../../../Translation';
import PromotionReservationDeadlineText from './PromotionReservationDeadlineText';

const PromotionReservationDeadline = ({
  startDate,
  expirationDate,
  status,
  promotionOption,
  loan,
}) => {
  const inThreeDays = moment().add(3, 'd');
  const momentDate = moment(expirationDate);
  const isTight = inThreeDays.isAfter(momentDate);
  const isAdmin = Meteor.microservice === 'admin';
  const {
    _id: promotionOptionId,
    reservationAgreement: { status: reservationAgreementStatus },
  } = promotionOption;

  if (
    status === PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE &&
    reservationAgreementStatus === PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED
  ) {
    return (
      <label htmlFor="expirationDate" style={{ marginBottom: 24 }}>
        <T id="Forms.expirationDate" />
        <Tooltip
          title={
            expirationDate ? (
              <span>
                {moment(startDate).format('D MMMM YYYY')}
                &nbsp;-&nbsp;
                {momentDate.format('D MMMM YYYY')}
              </span>
            ) : null
          }
        >
          <h3 className={cx('font-size-2 mt-0', { 'error-box': isTight })}>
            {expirationDate ? momentDate.fromNow() : 'Pas de date'}
            {isAdmin && (
              <AutoFormDialog
                schema={PromotionOptionSchema.getObjectSchema(
                  'reservationAgreement',
                ).pick('startDate', 'expirationDate')}
                model={{ startDate, expirationDate }}
                triggerComponent={handleOpen => (
                  <IconButton
                    onClick={() => handleOpen(true)}
                    type="edit"
                    className="ml-8"
                  />
                )}
                onSubmit={object =>
                  promotionOptionUpdate.run({
                    promotionOptionId,
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
          </h3>
        </Tooltip>
      </label>
    );
  }

  return (
    <PromotionReservationDeadlineText
      loan={loan}
      promotionOption={promotionOption}
    />
  );
};

export default PromotionReservationDeadline;
