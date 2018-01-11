import React from 'react';

import Icon from 'core/components/Icon';

import colors from 'core/config/colors';

const styles = {
  icon: {
    width: 32,
    height: 24,
    marginTop: 4,
  },
};

const FileStatusIcon = ({ files, status }) => {
  // Support providing a single status
  const statuses = status ? [status] : files.map(f => f.status);

  if (status === 'unverified' || ((!files || files.length === 0) && !status)) {
    return (
      <span
        style={{
          ...styles.icon,
          borderRadius: '50%',
          border: `2px solid ${colors.lightBorder}`,
          width: 24,
          marginRight: 8,
        }}
      />
    );
  } else if (statuses.indexOf('error') >= 0) {
    return <Icon type="warning" className="error" style={styles.icon} />;
  } else if (statuses.indexOf('unverified') >= 0) {
    return (
      <Icon type="waiting" color={colors.lightBorder} style={styles.icon} />
    );
  }

  return <Icon type="check" className="success" style={styles.icon} />;
};

FileStatusIcon.propTypes = {};
export default FileStatusIcon;
