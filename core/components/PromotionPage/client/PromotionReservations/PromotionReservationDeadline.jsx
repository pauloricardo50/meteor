import { Meteor } from 'meteor/meteor';

import React from 'react';
import cx from 'classnames';
import moment from 'moment';

import { getUserNameAndOrganisation } from '../../../../api/helpers';
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

const isApp = Meteor.microservice === 'app';

const PromotionReservationDeadline = ({
  startDate,
  expirationDate,
  status,
  promotionOption,
}) => {
  const inThreeDays = moment().add(3, 'd');
  const momentDate = moment(expirationDate);
  const isTight = inThreeDays.isAfter(momentDate);
  const isAdmin = Meteor.microservice === 'admin';
  const {
    _id: promotionOptionId,
    loan: { promotions = [] },
    reservationAgreement: { status: reservationAgreementStatus },
  } = promotionOption;
  const [promotion] = promotions;
  const {
    $metadata: { invitedBy },
    users = [],
  } = promotion;

  const pro = users.find(({ _id }) => _id === invitedBy);
  const proName = getUserNameAndOrganisation({ user: pro });

  if (
    status === PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE &&
    reservationAgreementStatus === PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED
  ) {
    return (
      <label htmlFor="expirationDate" style={{ marginBottom: 24 }}>
        <T id="Forms.expirationDate" />
        <Tooltip
          title={
            <span>
              {moment(startDate).format('D MMMM YYYY')}
              &nbsp;-&nbsp;
              {momentDate.format('D MMMM YYYY')}
            </span>
          }
        >
          <h1 className={cx({ 'error-box': isTight })}>
            {momentDate.fromNow()}
            {isAdmin && (
              <AutoFormDialog
                schema={PromotionOptionSchema.getObjectSchema(
                  'reservationAgreement',
                ).pick('startDate', 'expirationDate')}
                model={{ startDate, expirationDate }}
                triggerComponent={handleOpen => (
                  <IconButton onClick={() => handleOpen(true)} type="edit" />
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
          </h1>
        </Tooltip>
      </label>
    );
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <h1>
        <T id={`PromotionReservationDeadline.${status}`} />
      </h1>
      <p className="description">
        <T
          id={`PromotionReservationDeadline.${status}.description`}
          values={{ proName, isApp }}
        />
      </p>
    </div>
  );
};

export default PromotionReservationDeadline;
