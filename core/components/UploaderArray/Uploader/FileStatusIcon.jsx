import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'core/components/Icon';
import colors from 'core/config/colors';
import { FILE_STATUS } from 'core/api/constants';

const styles = {
  icon: {
    width: 32,
    height: 24,
    marginTop: 4,
  },
};

const statusIsTodo = (files, status) =>
  status === FILE_STATUS.UNVERIFIED
  || ((!files || files.length === 0) && !status);

const FileStatusIcon = ({ files, status }) => {
  // Support providing a single status
  const statuses = status ? [status] : files.map(f => f.status);

  if (statusIsTodo(files, status)) {
    return (
      <span
        style={{
          ...styles.icon,
          borderRadius: '50%',
          border: `2px solid ${colors.borderGrey}`,
          width: 24,
          marginRight: 8,
        }}
      />
    );
  }
  if (statuses.indexOf(FILE_STATUS.ERROR) >= 0) {
    return <Icon type="warning" className="error" style={styles.icon} />;
  }
  if (statuses.indexOf(FILE_STATUS.UNVERIFIED) >= 0) {
    return (
      <Icon type="waiting" color={colors.borderGrey} style={styles.icon} />
    );
  }

  return <Icon type="check" className="success" style={styles.icon} />;
};

FileStatusIcon.propTypes = {
  files: PropTypes.array,
  status: PropTypes.string,
};

FileStatusIcon.defaultProps = {
  files: [],
};

export default FileStatusIcon;
