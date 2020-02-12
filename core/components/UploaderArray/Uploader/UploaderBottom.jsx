import React from 'react';
import PropTypes from 'prop-types';

import TempFile from './TempFile';
import FileAdder from './FileAdder';
import File from './File';

const UploaderBottom = ({
  currentValue,
  disabled,
  draggable,
  dragProps,
  handleAddFiles,
  handleChangeError,
  handleRemove,
  handleRenameFile,
  handleUploadComplete,
  handleUploadFailed,
  handleChangeFileStatus,
  tempFiles,
  uploadDirective,
  uploadDirectiveProps,
  disableUpload,
  handleSetRoles,
  allowSetRoles,
}) => (
  <>
    {currentValue.map((f, i) => (
      <File
        key={f.Key + i}
        file={f}
        disabled={disabled}
        handleRemove={handleRemove}
        draggable={draggable}
        dragProps={dragProps}
        handleRenameFile={handleRenameFile}
        handleChangeError={handleChangeError}
        handleChangeFileStatus={handleChangeFileStatus}
        allowSetRoles={allowSetRoles}
        handleSetRoles={handleSetRoles}
      />
    ))}

    {tempFiles.map((f, i) => (
      <TempFile
        file={f}
        key={f.name + i} // if the same file is uploaded twice there's a conflict
        handleUploadComplete={handleUploadComplete}
        uploadDirective={uploadDirective}
        uploadDirectiveProps={uploadDirectiveProps}
        handleUploadFailed={handleUploadFailed}
      />
    ))}

    {!disableUpload && <FileAdder handleAddFiles={handleAddFiles} />}
  </>
);

UploaderBottom.propTypes = {
  currentValue: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool.isRequired,
  draggable: PropTypes.bool,
  dragProps: PropTypes.object,
  fileMeta: PropTypes.objectOf(PropTypes.any).isRequired,
  handleAddFiles: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleUploadComplete: PropTypes.func.isRequired,
  handleUploadFailed: PropTypes.func,
  setFileStatus: PropTypes.func,
  tempFiles: PropTypes.array.isRequired,
  uploadDirective: PropTypes.string.isRequired,
  uploadDirectiveProps: PropTypes.object.isRequired,
};

UploaderBottom.defaultProps = {
  currentValue: [],
};

export default UploaderBottom;
