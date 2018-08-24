import React from 'react';
import PropTypes from 'prop-types';

import UploaderContainer from './UploaderContainer';
import FileDropper from './FileDropper.jsx';
import UploaderTop from './UploaderTop.jsx';
import UploaderBottom from './UploaderBottom.jsx';

const Uploader = (props) => {
  const { handleAddFiles, shouldDisableAdd, displayFull, showFull } = props;
  const disableAdd = shouldDisableAdd();

  return (
    <FileDropper
      handleAddFiles={handleAddFiles}
      disabled={disableAdd}
      showFull={showFull}
    >
      <UploaderTop {...props} />
      {displayFull && <UploaderBottom {...props} />}
    </FileDropper>
  );
};

Uploader.propTypes = {
  displayFull: PropTypes.bool.isRequired,
  handleAddFiles: PropTypes.func.isRequired,
  shouldDisableAdd: PropTypes.func.isRequired,
  showFull: PropTypes.func.isRequired,
};

export default UploaderContainer(Uploader);
