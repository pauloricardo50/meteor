import React from 'react';

import PercentWithStatus from '../PercentWithStatus';
import T from '../Translation';

const FileTabLabel = ({ id, title, progress }) => (
  <span className="file-tab-label">
    <span className="name">{title || <T id={id} />}</span>
    &nbsp;&bull;&nbsp;
    <PercentWithStatus
      value={progress.percent}
      status={progress.percent < 1 ? null : undefined}
      rounded
    />
  </span>
);

export default FileTabLabel;
