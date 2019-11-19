// @flow
import React, { Component } from 'react';
import debounce from 'lodash/debounce';

import Loadable from 'core/utils/loadable';
import IconButton from 'core/components/IconButton';
import { withFileViewerContext } from 'core/containers/FileViewerContext';

// import ReactFileViewer from 'react-file-viewer';

const ReactFileViewer = Loadable({ loader: () => import('react-file-viewer') });

type FileViewerProps = {};

const minWidth = 300;

class FileViewer extends Component {
  constructor() {
    super();
    this.state = { isResizing: false, width: 1000 };
    this.handleResize();
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('resize', this.handleResize);
  }

  handleMouseDown = () => this.setState({ isResizing: true });

  handleMouseMove = e => {
    // we don't want to do anything if we aren't resizing.
    if (!this.state.isResizing) {
      return;
    }
    const { maxWidth } = this.state;
    const width = document.body.offsetWidth - e.clientX;

    if (width < minWidth) {
      return this.setState({ width: minWidth });
    }

    if (width > maxWidth) {
      return this.setState({ width: maxWidth });
    }

    return this.setState({ width });
  };

  handleMouseUp = e => this.setState({ isResizing: false });

  handleResize = debounce(() => {
    // Only set state on window width change, otherwise it's too costly
    if (window.innerWidth !== this.state.windowWidth) {
      const { width } = this.state;
      const maxWidth = 0.8 * window.innerWidth;
      this.setState({ maxWidth });

      if (width > maxWidth) {
        this.setState({ width: maxWidth });
      }
    }
  }, 500);

  render() {
    const { filePath, fileType, hideFileViewer } = this.props;
    const { width } = this.state;
    if (!filePath) {
      return null;
    }

    return (
      <div className="file-viewer" style={{ width }}>
        <div className="file-viewer-wrapper" style={{ width }}>
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
      </div>
    );
  }
}

export default withFileViewerContext(FileViewer);
