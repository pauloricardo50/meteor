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
  handleSave,
  handleAddFiles,
  fileMeta: { id, uploadCount },
  shouldDisableAdd,
}) => {
  const disableAdd = shouldDisableAdd();

  return (
    <React.Fragment>
      {currentValue
        .sort(({ fileCountA }, { fileCountB }) => fileCountA > fileCountB)
        .map(f => (
          <File
            key={f.key}
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
          handleSave={handleSave}
          id={id}
          currentValue={currentValue}
          uploadCount={uploadCount}
        />
      ))}

      {!disableAdd &&
        <FileAdder id={id} handleAddFiles={handleAddFiles} docId={docId} />
      }
    </React.Fragment>
  );
};

UploaderBottom.propTypes = {
  fileMeta: PropTypes.objectOf(PropTypes.any).isRequired,
  docId: PropTypes.string.isRequired,
  currentValue: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool.isRequired,
  collection: PropTypes.string,
  tempFiles: PropTypes.array.isRequired,
  shouldDisableAdd: PropTypes.func.isRequired,
  handleAddFiles: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

UploaderBottom.defaultProps = {
  currentValue: [],
  collection: 'loans',
};

export default UploaderBottom;
