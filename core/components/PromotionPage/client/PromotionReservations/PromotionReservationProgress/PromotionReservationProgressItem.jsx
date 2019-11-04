// @flow
import React from 'react';
import moment from 'moment';

import Icon from '../../../../Icon';
import T from '../../../../Translation';
import StatusDateForm from './StatusDateForm';

type PromotionReservationProgressItemProps = {};

const IconTooltip = ({ date, status, id, note, placeholder }) => (
  <div className="flex-col" style={{ flexGrow: 1 }}>
    <b className="flex sb">
      <T id={`Forms.${id}`} />
      &nbsp;
      {date && (
        <i className="secondary">{moment(date).format("H:mm, D MMM 'YY")}</i>
      )}
    </b>
    {note || placeholder || <T id={`Forms.status.${status}`} />}
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
  promotionOptionId,
  iconProps,
  note,
  placeholder,
  component,
}: PromotionReservationProgressItemProps) => {
  if (variant === 'text') {
    if (component) {
      return (
        !isEditing && (
          <p className="flex center-align">
            {component}
            <IconTooltip id={id} placeholder={placeholder} />
          </p>
        )
      );
    }
    return (
      <>
        <p className="flex center-align">
          <Icon type={icon} color={color} className="mr-16" {...iconProps} />
          <IconTooltip
            date={date}
            status={status}
            id={id}
            note={note}
            placeholder={placeholder}
          />
        </p>
        {isEditing && (
          <StatusDateForm
            model={{ status, note, date }}
            id={id}
            promotionOptionId={promotionOptionId}
          />
        )}
      </>
    );
  }

  if (component) {
    if (variant === 'label') {
      return (
        <div className="flex-col center-align">
          {component}
          <T id={`Forms.${id}`} />
        </div>
      );
    }
    return component;
  }

  const baseIcon = (
    <Icon
      type={icon}
      color={color}
      className="promotion-reservation-progress-icon"
      tooltip={(
        <IconTooltip
          date={date}
          status={status}
          id={id}
          note={note}
          placeholder={placeholder}
        />
      )}
      {...iconProps}
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
