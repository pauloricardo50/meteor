// @flow
import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'core/components/Icon';
import { SUCCESS, WARNING, ERROR } from 'core/api/constants';
import colors from 'core/config/colors';

const STATUSES = [SUCCESS, WARNING, ERROR];

const styles = {
  success: { color: colors.success },
  warning: { color: colors.warning },
  error: { color: colors.error },
};

const StatusIcon = ({ status, style = {}, ...rest }) => {
  if (!status) {
    return null;
  } if (status === SUCCESS) {
    return (
      <Icon
        type="checkCircle"
        style={{ ...styles.success, ...style }}
        {...rest}
      />
    );
  } if (status === WARNING) {
    return (
      <Icon type="error" style={{ ...styles.warning, ...style }} {...rest} />
    );
  } if (status === ERROR) {
    return (
      <Icon type="error" style={{ ...styles.error, ...style }} {...rest} />
    );
  }
};

StatusIcon.propTypes = {
  status: PropTypes.oneOf(STATUSES),
};

StatusIcon.defaultProps = {
  status: undefined,
};

export default StatusIcon;
