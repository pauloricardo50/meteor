import React, { useContext } from 'react';
import { compose, withStateHandlers } from 'recompose';

export const FileViewerContext = React.createContext();
export const { Consumer, Provider } = FileViewerContext;

export const withFileViewer = compose(
  withStateHandlers(
    {
      filePath: null,
      fileType: null,
      fileViewerType: 'file',
      pdfProps: null,
      pdfType: null,
    },
    {
      displayFile: () => (filePath, fileType) => ({
        filePath,
        fileType,
        fileViewerType: 'file',
        pdfProps: null,
        pdfType: null,
      }),
      hideFileViewer: () => () => ({
        filePath: null,
        fileType: null,
        pdfProps: null,
        pdfType: null,
      }),
      displayPdf: () => (pdfType, pdfProps) => ({
        filePath: null,
        fileType: null,
        fileViewerType: 'pdf',
        pdfProps,
        pdfType,
      }),
    },
  ),
  Component => ({
    displayFile,
    displayPdf,
    filePath,
    fileType,
    fileViewerType,
    hideFileViewer,
    pdfProps,
    pdfType,
    ...props
  }) => (
    <Provider
      value={{
        displayFile,
        displayPdf,
        filePath,
        fileType,
        fileViewerType,
        hideFileViewer,
        pdfProps,
        pdfType,
      }}
    >
      <Component {...props} />
    </Provider>
  ),
);

export const useFileViewer = () => useContext(Consumer);

export const withFileViewerContext = Component => props => (
  <Consumer>
    {fileViewerProps => <Component {...props} {...fileViewerProps} />}
  </Consumer>
);

export default useFileViewer;
