import React from 'react';

import { shouldDisplayFile } from '../../api/files/fileHelpers';
import Downloader from '../Downloader';
import Icon from '../Icon';

const getIconForFileType = key => {
  const extension = key.split('.').slice(-1)[0];

  switch (extension) {
    case 'pdf':
      return 'attachFile';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'image';
    default:
      return 'attachFile';
  }
};

const DocumentDownloadList = ({ files }) => {
  const filteredFiles = files.filter(shouldDisplayFile);

  if (!filteredFiles) {
    return null;
  }

  return (
    <div className="document-download-list">
      {filteredFiles.map(({ Key, name }) => (
        <Downloader key={Key} fileKey={Key} fileName={name}>
          {({ downloading, handleDownload }) => (
            <div
              className="card1 card-hover document"
              onClick={downloading ? null : handleDownload}
            >
              <Icon
                type={downloading ? 'loop-spin' : getIconForFileType(Key)}
              />
              <p>{name.split('.').slice(0, -1).join('.')}</p>
            </div>
          )}
        </Downloader>
      ))}
    </div>
  );
};
export default DocumentDownloadList;
