import React from 'react';
import PropTypes from 'prop-types';

import MuiIconButton from 'material-ui/IconButton';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import LoopIcon from 'material-ui/svg-icons/av/loop';

const getIcon = (type) => {
  const props = { color: '#444', hoverColor: '#888' };
  switch (type) {
    case 'close':
      return <CloseIcon {...props} />;
    case 'check':
      return <CheckIcon {...props} />;
    case 'add':
      return <AddIcon {...props} />;
    case 'download':
      return <DownloadIcon {...props} />;
    case 'loop':
      return <LoopIcon {...props} className="fa-spin" />;
    default:
      throw new Error('invalid icon provided to IconButton');
  }
};

const IconButton = ({ onClick, type, tooltip, touch, style }) => (
  <MuiIconButton
    onClick={onClick}
    tooltip={tooltip}
    touch={touch}
    style={style}
  >
    {getIcon(type)}
  </MuiIconButton>
);

IconButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  tooltip: PropTypes.node,
  touch: PropTypes.bool,
  style: PropTypes.objectOf(PropTypes.any),
};

IconButton.defaultProps = {
  tooltip: '',
  touch: true,
  style: {},
};

export default IconButton;
