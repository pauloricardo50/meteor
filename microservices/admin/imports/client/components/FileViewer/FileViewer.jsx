// @flow
import React from 'react';
import ReactFileViewer from 'react-file-viewer';

import IconButton from 'core/components/IconButton';
import { withFileViewerContext } from 'core/containers/FileViewerContext';

type FileViewerProps = {};

const FileViewer = ({
  filePath,
  fileType,
  hideFileViewer,
}: FileViewerProps) => {
  if (!filePath) {
    return null;
  }

  return (
    <div className="file-viewer">
      <IconButton
        onClick={hideFileViewer}
        type="close"
        className="file-viewer-closer"
      />
      <ReactFileViewer fileType={fileType} filePath={filePath} />
    </div>
  );
};

export default withFileViewerContext(FileViewer);
