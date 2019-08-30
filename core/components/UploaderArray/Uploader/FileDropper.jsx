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
  const oldDocId = event.dataTransfer.getData('docId');
  const oldCollection = event.dataTransfer.getData('collection');
  const oldId = event.dataTransfer.getData('id');
  const name = event.dataTransfer.getData('name');
  return { Key, name, oldDocId, oldCollection, oldId };
};

export default class FileDropper extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    if (!this.props.disabled) {
      this.setState({ dragging: true, target: e.target });
      this.props.showFull();
    }
  };

  handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === this.state.target) {
      this.setState({ dragging: false });
    }
  };

  handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ dragging: false });
    if (!this.props.disabled) {
      const isMove = e.dataTransfer.getData('move');
      if (isMove) {
        this.props.handleMoveFile(getMoveFileData(e));
      } else {
        this.props.handleAddFiles(getDataTransferItems(e));
      }
    }
  };

  pD = e => e.preventDefault();

  render() {
    const { children, id } = this.props;
    const { dragging } = this.state;

    return (
      <label
        className={classnames('uploader', { dragging })}
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
};

FileDropper.defaultProps = {
  disabled: false,
};
