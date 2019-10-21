// @flow
import React, { useContext } from 'react';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import { shouldAnonymize } from 'core/api/promotions/promotionClientHelpers';
import { PROMOTION_OPTION_STATUS } from 'core/api/constants';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import T from '../../../../../Translation';
import Button from '../../../../../Button';
import DialogSimple from '../../../../../DialogSimple';
import { getPromotionCustomerOwnerType } from '../../../../../../api/promotions/promotionClientHelpers';
import { bookPromotionLot } from '../../../../../../api/methods';
import PromotionReservationDetail from '../../../PromotionReservations/PromotionReservationDetail/PromotionReservationDetail';
import PromotionReservationProgress from '../../../PromotionReservations/PromotionReservationProgress/PromotionReservationProgress';

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
}: PromotionLotReservationProps) => {
  const currentUser = useContext(CurrentUserContext);
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
      renderTrigger={({ handleOpen }) => (
        <div className="flex center-align">
          <PromotionReservationProgress
            promotionOption={promotionOption}
            className="mr-8"
          />
          <Button raised primary onClick={handleOpen}>
            Détail
          </Button>
        </div>
      )}
    >
      <PromotionReservationDetail
        promotionOption={promotionOption}
        anonymize={anonymize}
      />
    </DialogSimple>
  );
};

export default PromotionLotReservation;
