import React from 'react';
import PropTypes from 'prop-types';

import FileDropper from './FileDropper';
import UploaderBottom from './UploaderBottom';
import UploaderTop from './UploaderTop';

const BaseUploader = ({
  toggleDisplayFull,
  handleMoveFile = () => {},
  variant,
  ...rest
}) => {
  const {
    handleAddFiles,
    displayFull,
    fileMeta: { id },
    currentValue: destinationFiles = [],
  } = rest;

  return (
    <FileDropper
      handleAddFiles={handleAddFiles}
      toggleDisplayFull={toggleDisplayFull}
      id={id}
      handleMoveFile={handleMoveFile(destinationFiles)}
      variant={variant}
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
