// @flow
import React from 'react';
import moment from 'moment';

import Icon from '../../../../Icon';
import T from '../../../../Translation';
import StatusDateForm from './StatusDateForm';

type PromotionReservationProgressItemProps = {};

const iconTooltip = ({ date, status, id }) =>
  date && (
    <div className="flex-col" style={{ flexGrow: 1 }}>
      <b className="flex sb">
        <T id={`Forms.${id}`} />
        &nbsp;
        <i className="secondary">{moment(date).format("h:mm, D MMM 'YY")}</i>
      </b>
      <T id={`Forms.status.${status}`} />
    </div>
  );

const PromotionReservationProgressItem = ({
  icon,
  color,
  date,
  status,
  id,
  variant,
  isEditing,
  promotionReservationId,
}: PromotionReservationProgressItemProps) => {
  if (variant === 'text') {
    return (
      <>
        <p className="flex center-align">
          <Icon type={icon} color={color} className="mr-16" />
          {iconTooltip({ date, status, id })}
        </p>
        {isEditing && (
          <StatusDateForm
            model={{ status, date }}
            id={id}
            promotionReservationId={promotionReservationId}
          />
        )}
      </>
    );
  }

  const baseIcon = (
    <Icon
      type={icon}
      color={color}
      className="promotion-reservation-progress-icon"
      tooltip={iconTooltip({ date, status, id })}
    />
  );

  if (variant === 'label') {
    return (
      <div className="flex-col center-align">
        {baseIcon}
        <T id={`Forms.${id}`} />
      </div>
    );
  }

  return baseIcon;
};

export default PromotionReservationProgressItem;
