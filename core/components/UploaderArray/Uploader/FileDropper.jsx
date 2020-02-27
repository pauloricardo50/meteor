import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// from https://github.com/react-dropzone/react-dropzone/blob/master/src/utils/index.js
const getDataTransferItems = event => {
  let dataTransferItemsList = [];
  if (event.dataTransfer) {
    const dt = event.dataTransfer;
    if (dt.files && dt.files.length) {
      dataTransferItemsList = dt.files;
    } else if (dt.items && dt.items.length) {
      // During the drag even the dataTransfer.files is null
      // but Chrome implements some drag store, which is accesible via dataTransfer.items
      dataTransferItemsList = dt.items;
    }
  } else if (event.target && event.target.files) {
    dataTransferItemsList = event.target.files;
  }
  // Convert from DataTransferItemsList to the native Array
  return Array.prototype.slice.call(dataTransferItemsList);
};

const getMoveFileData = event => {
  const Key = event.dataTransfer.getData('Key');
  const status = event.dataTransfer.getData('status');
  const oldCollection = event.dataTransfer.getData('collection');
  const name = event.dataTransfer.getData('name');
  return { Key, status, oldCollection, name };
};

export default class FileDropper extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleDragEnter = e => {
    const { disabled, toggleDisplayFull } = this.props;
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      this.setState({ dragging: true, target: e.target });
      toggleDisplayFull(true);
    }
  };

  handleDragLeave = e => {
    const { target } = this.state;
    e.preventDefault();
    e.stopPropagation();
    if (e.target === target) {
      this.setState({ dragging: false });
    }
  };

  handleDrop = e => {
    const { disabled, handleMoveFile, handleAddFiles } = this.props;
    e.preventDefault();
    e.stopPropagation();
    this.setState({ dragging: false });
    if (!disabled) {
      const isMove = e.dataTransfer.getData('move');
      if (isMove) {
        handleMoveFile(getMoveFileData(e));
      } else {
        handleAddFiles(getDataTransferItems(e));
      }
    }
  };

  pD = e => e.preventDefault();

  render() {
    const { children, id, variant } = this.props;
    const { dragging } = this.state;

    return (
      <label
        className={classnames('uploader', {
          dragging,
          normal: variant === 'normal',
          simple: variant === 'simple',
        })}
        onDragEnd={this.pD}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}
        onDrag={this.pD}
        onDragExit={this.pD}
        onDragOver={this.pD}
        htmlFor={id}
      >
        {children}
      </label>
    );
  }
}

FileDropper.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  handleAddFiles: PropTypes.func.isRequired,
  showFull: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['normal', 'simple']),
};

FileDropper.defaultProps = {
  disabled: false,
  variant: 'normal',
};
