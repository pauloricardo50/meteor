import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { injectIntl } from 'react-intl';

import cleanMethod from 'core/api/cleanMethods';
import { getFileCount } from 'core/api/files/files';
import bert from 'core/utils/bert';
import { allowedFileTypes, maxSize } from 'core/api/files/meteor-slingshot';
import { FILE_STATUS } from '../../api/constants';

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
    const {
      currentValue, docId, pushFunc, fileMeta,
    } = this.props;
    const { fileCount, fileCountString } = getFileCount(currentValue);

    const object = {
      [`files.${fileMeta.id}`]: {
        name: `${fileCountString}${file.name}`,
        initialName: file.name,
        size: file.size,
        type: file.type,
        url: encodeURI(downloadUrl), // To avoid spaces and unallowed chars
        key: downloadUrl.split('amazonaws.com/')[1],
        status: FILE_STATUS.UNVERIFIED,
        fileCount,
      },
    };

    cleanMethod(pushFunc, { object, id: docId }).then(() => {});
  };

  handleRemove = (key) => {
    Meteor.call('deleteFile', key, (err) => {
      if (!err) {
        const {
          currentValue, docId, updateFunc, fileMeta,
        } = this.props;
        // Filter out the file we want to delete
        const newFileArray = currentValue.filter(file => file.key !== key);
        const object = { [`files.${fileMeta.id}`]: newFileArray };

        cleanMethod(updateFunc, { object, id: docId });
      }
    });
  };

  render() {
    const {
      fileMeta,
      currentValue,
      disabled,
      docId,
      collection,
      pushFunc,
    } = this.props;
    const { tempFiles } = this.state;
    const { id } = fileMeta;
    // If one of the files has an error, allow uploading even if form is disabled
    const disableAdd =
      currentValue.reduce(
        (acc, f) => !(f.status === FILE_STATUS.ERROR),
        true,
      ) && disabled;

    return (
      <FileDropper
        className="uploader"
        handleAddFiles={this.handleAddFiles}
        disabled={disableAdd}
      >
        <Title {...fileMeta} currentValue={currentValue} />

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
  pushFunc: PropTypes.string,
  updateFunc: PropTypes.string,
  docId: PropTypes.string.isRequired,
  currentValue: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool.isRequired,
  collection: PropTypes.string,
};

Uploader.defaultProps = {
  currentValue: [],
  pushFunc: 'pushLoanValue',
  updateFunc: 'updateLoan',
  collection: 'loans',
};

export default injectIntl(Uploader);
