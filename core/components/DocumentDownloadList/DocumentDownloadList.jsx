// @flow
import React from 'react';

import Icon from '../Icon';
import Downloader from '../Downloader';

type DocumentDownloadListProps = {};

const DocumentDownloadList = ({ files }: DocumentDownloadListProps) => (
  <div className="document-download-list">
    {files
      && files.map(({ Key, name }) => (
        <Downloader key={Key} fileKey={Key} fileName={name}>
          {({ downloading, handleDownload }) => (
            <div
              className="card1 card-hover document"
              onClick={downloading ? null : handleDownload}
            >
              <Icon type={downloading ? 'loop-spin' : 'attachFile'} />
              <p>{name.split('.')[0]}</p>
            </div>
          )}
        </Downloader>
      ))}
  </div>
);

export default DocumentDownloadList;
