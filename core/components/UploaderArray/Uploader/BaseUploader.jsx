import React from 'react';
import PropTypes from 'prop-types';

import FileDropper from './FileDropper';
import UploaderBottom from './UploaderBottom';
import UploaderTop from './UploaderTop';

const BaseUploader = ({
  toggleDisplayFull,
  handleMoveFile = () => {},
  variant,
  showTop,
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
      {showTop && (
        <UploaderTop toggleDisplayFull={toggleDisplayFull} {...rest} />
      )}
      {displayFull && <UploaderBottom {...rest} id={id} />}
    </FileDropper>
  );
};

BaseUploader.propTypes = {
  displayFull: PropTypes.bool.isRequired,
  handleAddFiles: PropTypes.func.isRequired,
  showTop: PropTypes.bool,
};

BaseUploader.defaultProps = {
  showTop: true,
};

export default BaseUploader;
