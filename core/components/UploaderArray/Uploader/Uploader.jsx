import React from 'react';
import PropTypes from 'prop-types';

import UploaderContainer from './UploaderContainer';
import FileDropper from './FileDropper.jsx';
import UploaderTop from './UploaderTop.jsx';
import UploaderBottom from './UploaderBottom.jsx';

const Uploader = (props) => {
  const {
    handleAddFiles,
    displayFull,
    showFull,
    fileMeta: { id },
  } = props;

  return (
    <FileDropper
      handleAddFiles={handleAddFiles}
      showFull={showFull}
      id={id}
    >
      <UploaderTop {...props} />
      {displayFull && <UploaderBottom {...props} />}
    </FileDropper>
  );
};

Uploader.propTypes = {
  displayFull: PropTypes.bool.isRequired,
  handleAddFiles: PropTypes.func.isRequired,
  showFull: PropTypes.func.isRequired,
};

export default UploaderContainer(Uploader);
