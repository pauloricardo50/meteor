import React from 'react';
import PropTypes from 'prop-types';

import CheckIcon from 'material-ui/svg-icons/navigation/check';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import WaitingIcon from 'material-ui/svg-icons/action/hourglass-empty';

import colors from '/imports/js/config/colors';

const styles = {
  icon: {
    width: 32,
    height: 24,
    marginTop: 4,
  },
};

const FileStatusIcon = ({ files }) => {
  const statuses = files.map(f => f.status);

  if (!files || files.length === 0) {
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
    return <WarningIcon className="error" style={styles.icon} />;
  } else if (statuses.indexOf('unverified') >= 0) {
    return <WaitingIcon color={colors.lightBorder} style={styles.icon} />;
  }

  return <CheckIcon className="success" style={styles.icon} />;
};

FileStatusIcon.propTypes = {};

export default FileStatusIcon;
