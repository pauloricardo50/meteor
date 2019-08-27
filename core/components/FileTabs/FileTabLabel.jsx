// @flow
import React from 'react';

import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';

type FileTabLabelProps = {};

const FileTabLabel = ({ id, title, progress }: FileTabLabelProps) => (
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
