import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import cleanMethod from '/imports/api/cleanMethods';
import { getFileCount } from '/imports/js/arrays/files';

import Title from './Title';
import File from './File';
import TempFile from './TempFile';
import FileAdder from './FileAdder';

export default class Uploader extends Component {
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
                tempFiles: prev.tempFiles.filter(
                  f => f.name !== file.initialName,
                ),
              }));
            }
          });
        });
      }
    }
  }

  handleAddFiles = ({ target }) => {
    console.log(target.files[0]);
    console.log(this.props);
    const files = [];
    for (let i = 0; i < target.files.length; i += 1) {
      // Convert to Array
      files.push(target.files[i]);
    }

    this.setState(prev => ({ tempFiles: [...prev.tempFiles, ...files] }));
  };

  handleSave = (file, downloadUrl) => {
    const { currentValue, docId, pushFunc, fileMeta } = this.props;
    const { fileCount, fileCountString } = getFileCount(currentValue);

    const object = {
      [`files.${fileMeta.id}`]: {
        name: `${fileCountString}${file.name}`,
        initialName: file.name,
        size: file.size,
        type: file.type,
        url: encodeURI(downloadUrl), // To avoid spaces and unallowed chars
        key: downloadUrl.split('amazonaws.com/')[1],
        status: 'unverified',
        fileCount,
      },
    };

    cleanMethod(pushFunc, object, docId).then(() => {});
  };

  handleRemove = (key) => {
    Meteor.call('deleteFile', key, (err) => {
      if (!err) {
        const { currentValue, docId, updateFunc, fileMeta } = this.props;
        // Filter out the file we want to delete
        const newFileArray = currentValue.filter(file => file.key !== key);
        const object = { [`files.${fileMeta.id}`]: newFileArray };

        cleanMethod(updateFunc, object, docId);
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

    return (
      <div className="uploader">
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

        {!disabled && (
          <FileAdder
            id={fileMeta.id}
            handleAddFiles={this.handleAddFiles}
            docId={docId}
          />
        )}
      </div>
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
  pushFunc: 'pushRequestValue',
  updateFunc: 'updateRequest',
  collection: 'loanRequests',
};
