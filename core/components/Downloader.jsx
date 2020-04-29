import React, { useState } from 'react';
import fileSaver from 'file-saver';

import { downloadFile } from '../api/files/methodDefinitions';
import IconButton from './IconButton';
import T from './Translation';

const makeHandleClick = ({
  setShowTooltip,
  setDownloading,
  fileKey,
  fileName,
}) => event => {
  event.preventDefault();

  setShowTooltip(false);
  setDownloading(true);

  return downloadFile
    .run({ key: fileKey })
    .then(({ Body, ContentType: type }) => {
      const blob = new Blob([Body], { type });
      fileSaver.saveAs(blob, fileName);
    })
    .finally(() => setDownloading(false));
};

const Downloader = ({ children, fileKey, fileName, ...props }) => {
  const [downloading, setDownloading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const handleClick = makeHandleClick({
    fileKey,
    fileName,
    setShowTooltip,
    setDownloading,
  });

  if (children) {
    return children({ downloading, handleDownload: handleClick });
  }

  return (
    <IconButton
      type={downloading ? 'loop-spin' : 'download'}
      tooltip={<T id="general.download" />}
      onClick={handleClick}
      disabled={downloading}
      controlledTooltipProps={{
        open: showTooltip,
        onOpen: () => setShowTooltip(true),
        onClose: () => setShowTooltip(false),
      }}
      {...props}
    />
  );
};

export default Downloader;
