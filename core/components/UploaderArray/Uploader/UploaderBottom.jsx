import React from 'react';
import PropTypes from 'prop-types';

import TempFile from './TempFile';
import FileAdder from './FileAdder';
import File from './File';

const UploaderBottom = ({
  currentValue,
  disabled,
  handleRemove,
  tempFiles,
  docId,
  collection,
  handleUploadComplete,
  handleAddFiles,
  fileMeta,
}) => (
  <React.Fragment>
    {currentValue.map((f, i) => (
      <File
        key={f.Key + i}
        file={f}
        disabled={disabled}
        handleRemove={handleRemove}
      />
    ))}

    {tempFiles.map((f, i) => (
      <TempFile
        file={f}
        key={f.name + i} // if the same file is uploaded twice there's a conflict
        docId={docId}
        collection={collection}
        handleUploadComplete={handleUploadComplete}
        {...fileMeta}
      />
    ))}

    <FileAdder id={fileMeta.id} handleAddFiles={handleAddFiles} docId={docId} />
  </React.Fragment>
);

UploaderBottom.propTypes = {
  collection: PropTypes.string,
  currentValue: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool.isRequired,
  docId: PropTypes.string.isRequired,
  fileMeta: PropTypes.objectOf(PropTypes.any).isRequired,
  handleAddFiles: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleUploadComplete: PropTypes.func.isRequired,
  tempFiles: PropTypes.array.isRequired,
};

UploaderBottom.defaultProps = {
  currentValue: [],
  collection: 'loans',
};

export default UploaderBottom;
