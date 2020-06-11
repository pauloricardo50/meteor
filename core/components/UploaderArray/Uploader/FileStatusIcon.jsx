import React from 'react';
import PropTypes from 'prop-types';

import { FILE_STATUS } from '../../../api/files/fileConstants';
import colors from '../../../config/colors';
import Icon from '../../Icon';

const styles = { icon: { width: 32, height: 24 } };

const statusIsTodo = (files, status) =>
  status === FILE_STATUS.UNVERIFIED ||
  ((!files || files.length === 0) && !status);

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
          width: 20,
          height: 20,
          marginRight: 8,
          flexShrink: 0,
        }}
        className="file-status-icon"
      />
    );
  }
  if (statuses.indexOf(FILE_STATUS.ERROR) >= 0) {
    return (
      <Icon
        type="warning"
        className="file-status-icon error"
        style={styles.icon}
      />
    );
  }
  if (statuses.indexOf(FILE_STATUS.UNVERIFIED) >= 0) {
    return (
      <Icon
        type="waiting"
        color={colors.borderGrey}
        style={styles.icon}
        className="file-status-icon"
      />
    );
  }

  return (
    <Icon
      type="check"
      className="file-status-icon success"
      style={styles.icon}
    />
  );
};

FileStatusIcon.propTypes = {
  files: PropTypes.array,
  status: PropTypes.string,
};

FileStatusIcon.defaultProps = {
  files: [],
};

export default FileStatusIcon;
