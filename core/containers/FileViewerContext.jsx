import React from 'react';
import { compose, withStateHandlers } from 'recompose';

export const FileViewerContext = React.createContext();
export const { Consumer, Provider } = FileViewerContext;

export const withFileViewer = compose(
  withStateHandlers(
    { filePath: null, fileType: null },
    {
      displayFile: () => (filePath, fileType) => ({ filePath, fileType }),
      hideFileViewer: () => () => ({ filePath: null, fileType: null }),
    },
  ),
  Component => ({
    displayFile,
    hideFileViewer,
    filePath,
    fileType,
    ...props
  }) => (
    <Provider value={{ displayFile, hideFileViewer, filePath, fileType }}>
      <Component {...props} />
    </Provider>
  ),
);

export const withFileViewerContext = Component => props => (
  <Consumer>
    {fileViewerProps => <Component {...props} {...fileViewerProps} />}
  </Consumer>
);
