import React from 'react';
import PropTypes from 'prop-types';

import FileDropper from './FileDropper';
import UploaderTop from './UploaderTop';
import UploaderBottom from './UploaderBottom';

const BaseUploader = ({ toggleDisplayFull, handleMoveFile, ...rest }) => {
  const {
    handleAddFiles,
    displayFull,
    fileMeta: { id },
  } = rest;

  return (
    <FileDropper
      handleAddFiles={handleAddFiles}
      toggleDisplayFull={toggleDisplayFull}
      id={id}
      handleMoveFile={handleMoveFile}
    >
      <UploaderTop toggleDisplayFull={toggleDisplayFull} {...rest} />
      {displayFull && <UploaderBottom {...rest} id={id} />}
    </FileDropper>
  );
};

BaseUploader.propTypes = {
  displayFull: PropTypes.bool.isRequired,
  handleAddFiles: PropTypes.func.isRequired,
  showFull: PropTypes.func.isRequired,
};

export default BaseUploader;
