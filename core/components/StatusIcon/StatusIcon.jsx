// @flow
import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';

import Icon from 'core/components/Icon';
import { SUCCESS } from 'core/api/constants';
import T from '../Translation';

const StatusIcon = React.forwardRef(
  ({ id, status, style = {}, tooltip, ...rest }, ref) => {
    if (!status) {
      return null;
    }

    const icon = (
      <Icon
        type={status === SUCCESS ? 'checkCircle' : 'error'}
        color={status.toLowerCase()}
        style={style}
        ref={ref}
        {...rest}
      />
    );

    if (tooltip) {
      return (
        <Tooltip
          title={
            typeof tooltip === 'object' ? (
              tooltip
            ) : (
              <T id={`StatusIconTooltip.${id}.${status}`} />
            )
          }
          placement="right"
          enterTouchDelay={0}
        >
          {icon}
        </Tooltip>
      );
    }

    return icon;
  },
);

StatusIcon.propTypes = {
  status: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

StatusIcon.defaultProps = {
  status: undefined,
};

export default StatusIcon;
