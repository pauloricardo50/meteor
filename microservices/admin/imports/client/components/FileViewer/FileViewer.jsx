// @flow
import React, { Component } from 'react';

import Loadable from 'core/utils/loadable';
import IconButton from 'core/components/IconButton';
import { withFileViewerContext } from 'core/containers/FileViewerContext';

// import ReactFileViewer from 'react-file-viewer';

const ReactFileViewer = Loadable({ loader: () => import('react-file-viewer') });

type FileViewerProps = {};

class FileViewer extends Component {
  constructor() {
    super();
    this.state = { isResizing: false, width: 1000 };
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseDown = () => this.setState({ isResizing: true });

  handleMouseMove = (e) => {
    // we don't want to do anything if we aren't resizing.
    if (!this.state.isResizing) {
      return;
    }

    const offsetRight = document.body.offsetWidth - (e.clientX - document.body.offsetLeft);
    const minWidth = 300;
    const maxWidth = 1500;
    if (offsetRight > minWidth && offsetRight < maxWidth) {
      this.setState({ width: offsetRight });
    }
  };

  handleMouseUp = e => this.setState({ isResizing: false });

  render() {
    const { filePath, fileType, hideFileViewer } = this.props;
    const { width } = this.state;
    if (!filePath) {
      return null;
    }

    return (
      <div className="file-viewer" style={{ width }}>
        <IconButton
          onClick={hideFileViewer}
          type="close"
          className="file-viewer-closer"
        />
        <IconButton
          type="dragHandle"
          className="file-viewer-resizer"
          onMouseDown={this.handleMouseDown}
        />
        <ReactFileViewer
          fileType={fileType}
          filePath={filePath}
          key={filePath}
        />
      </div>
    );
  }
}

export default withFileViewerContext(FileViewer);
