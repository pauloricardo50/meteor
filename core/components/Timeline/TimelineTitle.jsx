//      
import React from 'react';
import moment from 'moment';

import Icon from '../Icon';
import Tooltip from '../Material/Tooltip';

                             

const TimelineTitle = ({ title, icon, date, children, iconStyle }                    ) => (
  <div className="timeline-title">
    {children}
    <h4 className="title">
      <Icon className="icon secondary" fontSize="small" type={icon} style={iconStyle} />
      <Tooltip title={title} placement="top-start">
        <span className="text">{title}</span>
      </Tooltip>
    </h4>
    <h4 className="secondary">
      <small>{moment(date).format("D MMM 'YY")}</small>
    </h4>
  </div>
);

export default TimelineTitle;
