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

  handleAddFiles = ({ target }) => {
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
        size: file.size,
        type: file.type,
        url: downloadUrl,
        key: downloadUrl.split('amazonaws.com/')[1],
        status: 'unverified',
        fileCount,
      },
    };

    cleanMethod(pushFunc, object, docId).then(() => {
      // Remove uploaded file from tempFiles
      this.setState(prev => ({
        tempFiles: prev.tempFiles.filter(f => f.name !== file.name),
      }));
    });
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
    const { fileMeta, currentValue, disabled, docId, collection } = this.props;
    const { tempFiles } = this.state;
    const { id } = fileMeta;

    return (
      <div className="uploader">
        <Title {...fileMeta} currentValue={currentValue} />

        {currentValue.map(f => (
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
            key={f.name + i}
            docId={docId}
            collection={collection}
            handleSave={this.handleSave}
            id={id}
          />
        ))}

        {!disabled && (
          <FileAdder id={fileMeta.id} handleAddFiles={this.handleAddFiles} />
        )}
      </div>
    );
  }
}

Uploader.propTypes = {
  fileMeta: PropTypes.objectOf(PropTypes.any).isRequired,
  pushFunc: PropTypes.string.isRequired,
  updateFunc: PropTypes.string.isRequired,
  docId: PropTypes.string.isRequired,
  currentValue: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool.isRequired,
  collection: PropTypes.string.isRequired,
};

Uploader.defaultProps = {
  currentValue: [],
};
