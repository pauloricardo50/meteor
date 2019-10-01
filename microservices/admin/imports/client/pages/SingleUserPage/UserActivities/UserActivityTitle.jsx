// @flow
import React from 'react';
import moment from 'moment';
import Tooltip from '@material-ui/core/Tooltip';

import Icon from 'core/components/Icon';

type UserActivityTitleProps = {
  activity: Object,
};

const UserActivityTitle = ({ activity }: UserActivityTitleProps) => {
  const { date, title } = activity;
  return (
    <div className="user-activity-title">
      <h4 className="title">
        <Icon className="icon secondary" fontSize="small" type="computer" />
        <Tooltip title={title} placement="top-start">
          <span className="text">{title}</span>
        </Tooltip>
      </h4>
      <h4 className="secondary">
        <small>{moment(date).format("D MMM 'YY")}</small>
      </h4>
    </div>
  );
};

export default UserActivityTitle;
