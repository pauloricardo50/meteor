import React from 'react';
import PropTypes from 'prop-types';

import FileDropper from './FileDropper.jsx';
import UploaderTop from './UploaderTop.jsx';
import UploaderBottom from './UploaderBottom.jsx';

const BaseUploader = (props) => {
  const {
    handleAddFiles,
    displayFull,
    showFull,
    fileMeta: { id },
    handleMoveFile,
  } = props;

  return (
    <FileDropper
      handleAddFiles={handleAddFiles}
      showFull={showFull}
      id={id}
      handleMoveFile={handleMoveFile}
    >
      <UploaderTop {...props} />
      {displayFull && <UploaderBottom {...props} id={id} />}
    </FileDropper>
  );
};

BaseUploader.propTypes = {
  displayFull: PropTypes.bool.isRequired,
  handleAddFiles: PropTypes.func.isRequired,
  showFull: PropTypes.func.isRequired,
};

export default BaseUploader;
