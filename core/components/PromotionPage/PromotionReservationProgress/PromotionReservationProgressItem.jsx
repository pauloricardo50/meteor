import { Meteor } from 'meteor/meteor';

import React, { useState } from 'react';
import cx from 'classnames';
import moment from 'moment';

import Icon from '../../Icon';
import T from '../../Translation';
import StatusDateDialogForm from './StatusDateDialogForm';

const isAdmin = Meteor.microservice === 'admin';

const allowModification = id => isAdmin && id !== 'proNote';

const defaultRenderStatus = ({ note, placeholder, status }) =>
  note || placeholder || <T id={`Forms.status.${status}`} />;

const IconTooltip = ({
  date,
  status,
  id,
  note,
  placeholder,
  renderStatus = defaultRenderStatus,
}) => {
  // Adjust timezone
  const timezonedDate =
    date && new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return (
    <div className="promotion-reservation-progress-item-tooltip">
      <b className="flex sb">
        <T id={`Forms.${id}`} />
        &nbsp;
        {date && (
          <i className="secondary">
            {moment(timezonedDate).format("H:mm, D MMM 'YY")}
          </i>
        )}
      </b>
      {renderStatus({ id, note, placeholder, status })}
    </div>
  );
};

const PromotionReservationProgressItem = ({
  icon,
  color,
  date,
  status,
  id,
  variant,
  promotionOptionId,
  iconProps,
  note,
  placeholder,
  renderComponent,
  loanId,
  withTooltip = true,
  withIcon = true,
  renderStatus,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const allowModify = allowModification(id);

  if (variant === 'text') {
    if (renderComponent) {
      return (
        <p className="flex center-align">
          {withIcon && renderComponent}
          <IconTooltip
            id={id}
            placeholder={placeholder}
            renderStatus={renderStatus}
          />
        </p>
      );
    }
    return (
      <>
        <p
          className={cx(
            'flex center-align',
            allowModify && 'reservation-progress-item-modify',
          )}
          onClick={() => (allowModify ? setOpenDialog(!openDialog) : null)}
        >
          {withIcon && (
            <Icon type={icon} color={color} className="mr-16" {...iconProps} />
          )}
          {allowModify && (
            <StatusDateDialogForm
              promotionOptionId={promotionOptionId}
              loanId={loanId}
              id={id}
              status={status}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
            />
          )}
          <IconTooltip
            date={date}
            status={status}
            id={id}
            note={note}
            placeholder={placeholder}
            renderStatus={renderStatus}
          />
        </p>
      </>
    );
  }

  if (renderComponent) {
    if (variant === 'label') {
      return (
        <div className="flex-col center-align">
          {withIcon && renderComponent}
          <T id={`Forms.${id}`} />
        </div>
      );
    }
    return renderComponent;
  }

  const baseIcon = (
    <Icon
      type={icon}
      color={color}
      className="promotion-reservation-progress-icon"
      tooltip={
        withTooltip && (
          <IconTooltip
            date={date}
            status={status}
            id={id}
            note={note}
            placeholder={placeholder}
            renderStatus={renderStatus}
          />
        )
      }
      {...iconProps}
    />
  );

  if (variant === 'label') {
    return (
      <div className="flex-col center-align">
        {withIcon && baseIcon}
        <T id={`Forms.${id}`} />
      </div>
    );
  }

  return baseIcon;
};

export default PromotionReservationProgressItem;
