import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import bert from 'core/utils/bert';
import { allowedFileTypes, maxSize } from 'core/api/files/meteor-slingshot';
import { FILE_STATUS } from '../../api/constants';

import UploaderContainer from './UploaderContainer';
import Title from './Title';
import File from './File';
import TempFile from './TempFile';
import FileAdder from './FileAdder';
import FileDropper from './FileDropper';

const checkFile = (file) => {
  if (allowedFileTypes.indexOf(file.type) < 0) {
    return 'fileType';
  } else if (file.size > maxSize) {
    return 'fileSize';
  }
  return true;
};

class Uploader extends Component {
  constructor(props) {
    super(props);

    this.state = { tempFiles: [] };
  }

  // Remove temp files from state when they are saved to the DB, and appear in
  // props.
  // FIXME: This prevents someone from uploading a file with the same name twice
  componentWillReceiveProps(nextProps) {
    const { currentValue: nextValue } = nextProps;
    const { currentValue } = this.props;

    if (nextValue.length !== currentValue.length) {
      const { tempFiles } = this.state;

      if (tempFiles && tempFiles.length) {
        nextValue.forEach((file) => {
          tempFiles.forEach((temp) => {
            if (temp.name === file.initialName) {
              this.setState(prev => ({
                tempFiles: prev.tempFiles.filter(f => f.name !== file.initialName),
              }));
            }
          });
        });
      }
    }
  }

  handleAddFiles = (files = []) => {
    const fileArray = [];
    let showError = false;

    files.forEach((file) => {
      const isValid = checkFile(file);
      if (isValid === true) {
        fileArray.push(file);
      } else {
        showError = isValid;
      }
    });

    if (showError) {
      const { intl } = this.props;
      const { formatMessage: f } = intl;
      bert(
        f({ id: `error.${showError}.title` }),
        f({ id: `error.${showError}.description` }),
        'danger',
      );
      return;
    }

    this.setState(prev => ({ tempFiles: [...prev.tempFiles, ...files] }));
  };

  handleSave = (file, downloadUrl) => {
    const { addFileToDoc } = this.props;

    addFileToDoc({
      initialName: file.name,
      size: file.size,
      type: file.type,
      url: encodeURI(downloadUrl), // To avoid spaces and unallowed chars
      key: downloadUrl.split('amazonaws.com/')[1],
    });
  };

  handleRemove = (key) => {
    const { deleteFile } = this.props;

    deleteFile(key);
  };

  // If one of the files has an error, allow uploading even if form is disabled
  shouldDisableAdd = () =>
    this.props.currentValue.reduce(
      (acc, f) => !(f.status === FILE_STATUS.ERROR),
      true,
    ) && this.props.disabled;

  render() {
    const {
      fileMeta,
      currentValue,
      disabled,
      docId,
      collection,
      userIsAdmin,
      documentIsAdmin,
      removeDocument,
    } = this.props;
    const { tempFiles } = this.state;
    const { id, uploadCount } = fileMeta;
    const disableAdd = this.shouldDisableAdd();

    return (
      <FileDropper
        className="uploader"
        handleAddFiles={this.handleAddFiles}
        disabled={disableAdd}
      >
        <Title
          {...fileMeta}
          currentValue={currentValue}
          userIsAdmin={userIsAdmin}
          documentIsAdmin={documentIsAdmin}
          removeDocument={removeDocument}
        />

        {currentValue
          .sort((a, b) => a.fileCount > b.fileCount)
          .map(f => (
            <File
              key={f.key}
              file={f}
              disabled={disabled}
              handleRemove={this.handleRemove}
            />
          ))}

        {tempFiles.map((f, i) => (
          <TempFile
            file={f}
            key={f.name + i} // if the same file is uploaded twice there's a conflict
            docId={docId}
            collection={collection}
            handleSave={this.handleSave}
            id={id}
            currentValue={currentValue}
            uploadCount={uploadCount}
          />
        ))}

        {!disableAdd && (
          <FileAdder
            id={fileMeta.id}
            handleAddFiles={this.handleAddFiles}
            docId={docId}
          />
        )}
      </FileDropper>
    );
  }
}

Uploader.propTypes = {
  fileMeta: PropTypes.objectOf(PropTypes.any).isRequired,
  docId: PropTypes.string.isRequired,
  currentValue: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool.isRequired,
  collection: PropTypes.string,
  deleteFile: PropTypes.func.isRequired,
  addFileToDoc: PropTypes.func.isRequired,
  userIsAdmin: PropTypes.bool.isRequired,
  documentIsAdmin: PropTypes.bool.isRequired,
  removeDocument: PropTypes.func.isRequired,
};

Uploader.defaultProps = {
  currentValue: [],
  collection: 'loans',
};

export default UploaderContainer(injectIntl(Uploader));
