import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import UploaderContainer from './UploaderContainer';
import Title from './Title';
import File from './File';
import TempFile from './TempFile';
import FileAdder from './FileAdder';
import FileDropper from './FileDropper.jsx';

const Uploader = ({
  fileMeta,
  currentValue,
  disabled,
  docId,
  collection,
  userIsAdmin,
  isOwnedByAdmin,
  removeDocument,
  tempFiles,
  shouldDisableAdd,
  handleAddFiles,
  handleRemove,
  handleSave,
}) => {
  const { id, uploadCount } = fileMeta;
  const disableAdd = shouldDisableAdd();

  return (
    <FileDropper
      className="uploader"
      handleAddFiles={handleAddFiles}
      disabled={disableAdd}
    >
      <Title
        {...fileMeta}
        currentValue={currentValue}
        userIsAdmin={userIsAdmin}
        isOwnedByAdmin={isOwnedByAdmin}
        removeDocument={removeDocument}
      />

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

      {!disableAdd && (
        <FileAdder id={id} handleAddFiles={handleAddFiles} docId={docId} />
      )}
    </FileDropper>
  );
};

Uploader.propTypes = {
  fileMeta: PropTypes.objectOf(PropTypes.any).isRequired,
  docId: PropTypes.string.isRequired,
  currentValue: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool.isRequired,
  collection: PropTypes.string,
  deleteFile: PropTypes.func.isRequired,
  addFileToDoc: PropTypes.func.isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
  isOwnedByAdmin: PropTypes.bool.isRequired,
  removeDocument: PropTypes.func.isRequired,
  tempFiles: PropTypes.array.isRequired,
  shouldDisableAdd: PropTypes.func.isRequired,
  handleAddFiles: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

Uploader.defaultProps = {
  currentValue: [],
  collection: 'loans',
};

export default UploaderContainer(injectIntl(Uploader));
