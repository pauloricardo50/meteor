import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'core/components/Icon';
import { SUCCESS, WARNING, ERROR } from 'core/api/constants';
import colors from 'core/config/colors';

const statuses = [SUCCESS, WARNING, ERROR];

const styles = {
  success: { color: colors.success },
  warning: { color: colors.warning },
  error: { color: colors.error },
};

const StatusIcon = ({ status, ...rest }) => {
  if (!status) {
    return null;
  } else if (status === SUCCESS) {
    return <Icon type="checkCircle" style={styles.success} {...rest} />;
  } else if (status === WARNING) {
    return <Icon type="error" style={styles.warning} {...rest} />;
  } else if (status === ERROR) {
    return <Icon type="error" style={styles.error} {...rest} />;
  }
};

StatusIcon.propTypes = {
  status: PropTypes.oneOf(statuses),
};

StatusIcon.defaultProps = {
  status: undefined,
};

export default StatusIcon;
