// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/pro-light-svg-icons/faHome';
import { faPlus } from '@fortawesome/pro-light-svg-icons/faPlus';

import ConfirmMethod from 'core/components/ConfirmMethod';
import T from 'core/components/Translation';
import { promotionOptionActivateReservation } from 'core/api/methods';
import { PROMOTION_OPTION_STATUS } from 'core/api/constants';
import colors from 'core/config/colors';
import { getUserNameAndOrganisation } from 'core/api/helpers';

type RequestReservationProps = {
  promotionOption: Object,
  promotionLotName: String,
  status: String,
};

const RequestReservation = ({
  promotionOption,
  promotionLotName,
  status,
}: RequestReservationProps) => {
  const {
    _id: promotionOptionId,
    loan: { promotions = [] },
  } = promotionOption;

  const [promotion] = promotions;
  const {
    $metadata: { invitedBy },
    users = [],
  } = promotion;

  const pro = users.find(({ _id }) => _id === invitedBy);
  const proName = getUserNameAndOrganisation({ user: pro });

  return (
    <ConfirmMethod
      type="modal"
      method={() =>
        promotionOptionActivateReservation.run({ promotionOptionId })
      }
      label={<T id="PromotionPage.lots.requestReservation.button" />}
      buttonProps={{
        secondary: true,
        raised: true,
        disabled: status !== PROMOTION_OPTION_STATUS.INTERESTED,
        style: { alignSelf: 'center' },
      }}
      title={<T id="PromotionPage.lots.requestReservation.title" />}
      description={
        <div className="request-reservation-description">
          <span className="fa-layers fa-fw icon">
            <FontAwesomeIcon
              icon={faHome}
              transform="grow-60 down-10 left-10"
              color={colors.primary}
            />
            <FontAwesomeIcon
              icon={faPlus}
              transform="up-24 right-40 grow-16"
              color={colors.success}
              className="animated fadeInUp delay-400"
            />
          </span>
          <T
            id="PromotionPage.lots.requestReservation.description"
            values={{ promotionLotName, proName }}
          />
        </div>
      }
      onClick={e => {
        e.stopPropagation();
      }}
    />
  );
};

export default RequestReservation;
