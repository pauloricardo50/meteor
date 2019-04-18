// @flow
import React from 'react';

import Loadable from 'core/utils/loadable';
import IconButton from 'core/components/IconButton';
import { withFileViewerContext } from 'core/containers/FileViewerContext';

const ReactFileViewer = Loadable({ loader: () => 'react-file-viewer' });

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
      <ReactFileViewer fileType={fileType} filePath={filePath} key={filePath} />
    </div>
  );
};

export default withFileViewerContext(FileViewer);
